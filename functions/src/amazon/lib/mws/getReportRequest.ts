// import * as functions from 'firebase-functions';

// const amazonMws = require("amazon-mws")(
//     process.env.AMAZON_MWS_ACCESS_KEY,
//     process.env.AMAZON_MWS_SECRET_KEY
// )
// amazonMws.setResponseFormat("JSON")

// const getReportRequest = async ( uid: string ) => {
//     const amazon = new AmazonCred(uid, "read");
//     let amazonCred = await amazon.read();
//     return amazonMws.reports
//       .submit({
//         Version: config.version,
//         Action: config.requestReport,
//         SellerId: amazonCred.sellerID,
//         MWSAuthToken: amazonCred.authToken,
//         ReportType: config.reportType,
//       })
//       .then((response) => {
//         return getReportRequestList(
//           response.ReportRequestInfo.ReportRequestId,
//           amazonCred
//         );
//       })
//       .then((reportId) => {
//         return getReport(reportId, amazonCred);
//       })
//       .catch((err) => {
//         console.log("error: ", err);
//       });
//   };
  