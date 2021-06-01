import getReportRequest from '../lib/mws/getReportRequest';
import setActiveListings from '../lib/mws/setActiveListings';

const getReport = async (
  uid: string,
  reportType: string,
  version: string
): Promise<Object> => {
  const reportParams = {
    reportType,
    version,
  };

  const report = await getReportRequest(uid, reportParams);
  return report;
};

export { getReport, setActiveListings };
