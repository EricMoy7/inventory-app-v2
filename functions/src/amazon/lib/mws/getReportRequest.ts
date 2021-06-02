import amazonMws from '../mwsApi';
import * as userCreds from '../userData/getUserCreds';
import { UserCredentials } from '../../../types';

const config = {
  requestReport: 'RequestReport',
  getReportRequestList: 'GetReportRequestList',
  getReport: 'GetReport',
};

amazonMws.setResponseFormat('JSON');

const getReportRequest = async (
  uid: string,
  reportParams: Record<string, unknown>
): Promise<string> => {
  const amazonCred = await userCreds.getUserCreds(uid);
  return amazonMws.reports
    .submit({
      Version: reportParams.version,
      Action: config.requestReport,
      SellerId: amazonCred.sellerId,
      MWSAuthToken: amazonCred.mwsAuthToken,
      ReportType: reportParams.reportType,
    })
    .then((response) => {
      return getReportRequestList(
        response.ReportRequestInfo.ReportRequestId,
        amazonCred,
        reportParams
      );
    })
    .then((reportId) => {
      return getReport(reportId, amazonCred, reportParams);
    })
    .catch((err) => {
      console.log('error: ', err);
    });
};

const getReportRequestList = async (
  reportId: string,
  amazonCred: UserCredentials,
  reportParams: Record<string, unknown>
) => {
  let response;
  try {
    do {
      await new Promise((r) => setTimeout(r, 10000));
      response = await amazonMws.reports.search({
        Version: reportParams.version,
        Action: config.getReportRequestList,
        SellerId: amazonCred.sellerId,
        MWSAuthToken: amazonCred.mwsAuthToken,
        'ReportRequestIdList.Id.1': reportId,
      });
    } while (response.ReportRequestInfo.ReportProcessingStatus !== '_DONE_');
    return response.ReportRequestInfo.GeneratedReportId;
  } catch (err) {
    console.log('Error (getReportRequestList)', err);
    return;
  }
};

// eslint-disable-next-line max-len
const getReport = async (
  reportId: string,
  amazonCred: UserCredentials,
  reportParams: Record<string, unknown>
) => {
  let response;
  try {
    response = await amazonMws.reports.search({
      Version: reportParams.version,
      Action: config.getReport,
      SellerId: amazonCred.sellerId,
      MWSAuthToken: amazonCred.mwsAuthToken,
      ReportId: reportId,
    });
    return response;
  } catch (err) {
    console.log('Error (getReport)', err);
    return;
  }
};

export default getReportRequest;
