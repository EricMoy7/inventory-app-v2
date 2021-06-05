import amazonMws from '../mwsApi';
import { UserCredentials, ReportIdData } from '../../../types';

const config = {
  requestReport: 'RequestReport',
  getReportRequestList: 'GetReportRequestList',
  getReport: 'GetReport',
};

amazonMws.setResponseFormat('JSON');

const getReportRequest = async (
  reportParams: ReportIdData,
  amazonCred: UserCredentials
): Promise<string> => {
  const response = await amazonMws.reports.submit({
    Version: reportParams.version,
    Action: config.requestReport,
    SellerId: amazonCred.sellerId,
    MWSAuthToken: amazonCred.mwsAuthToken,
    ReportType: reportParams.reportType,
  });

  return response.ReportRequestInfo.ReportRequestId;
};

const getReportRequestList = async (
  requestId: string,
  amazonCred: UserCredentials,
  reportParams: ReportIdData
) => {
  let response;
  try {
    do {
      await new Promise((r) => setTimeout(r, 5000));
      response = await amazonMws.reports.search({
        Version: reportParams.version,
        Action: config.getReportRequestList,
        SellerId: amazonCred.sellerId,
        MWSAuthToken: amazonCred.mwsAuthToken,
        'ReportRequestIdList.Id.1': requestId,
      });
      if (response.ReportRequestInfo.ReportProcessingStatus !== '_CANCELLED_') {
        break;
      }
    } while (response.ReportRequestInfo.ReportProcessingStatus !== '_DONE_');
    return response.ReportRequestInfo.GeneratedReportId;
  } catch (err) {
    console.log('Error (getReportRequestList)', err);
    return;
  }
};

const getReport = async (
  reportId: string,
  amazonCred: UserCredentials,
  reportParams: ReportIdData
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

export { getReportRequest, getReportRequestList, getReport };
