import {
  getReportRequest,
  getReportRequestList,
  getReport,
} from '../lib/mws/getReportRequest';
import * as userCreds from '../lib/userData/getUserCreds';
import firebase from '../../firebase/service';
import { ReportIdData } from '../../types';

const GetReportRequest = async (
  uid: string,
  reportParams: Array<{ [key: string]: string }>
  //TODO: create interface for return type
): Promise<Array<ReportIdData>> => {
  const batch = firebase.firestore().batch();

  let reportArray: Array<ReportIdData> = [];

  for (let i = 0; i < reportParams.length; i++) {
    //Get user data from DB
    const amazonCred = await userCreds.getUserCreds(uid);

    //Get requestId from amazon mws api
    const requestId = await getReportRequest(reportParams[i], amazonCred);

    //Setup data to return to user
    const reportData = {
      reportType: reportParams.reportType,
      requestId,
    };
    reportArray = [...reportArray, reportData];

    //Set document DB path
    const path = `users/${uid}`;

    //Setup object with previous data to return to DB
    let requestDetails = { ...amazonCred[reportParams.reportType], requestId };

    //Setup batch for each item of reportParams with Request details
    batch.set(
      firebase.firestore().doc(path),
      {
        [reportParams[i].reportType]: requestDetails,
      },
      { merge: true }
    );
  }
  //Commit entire interative batch to DB
  await batch.commit();

  //Returns an array of objects of completed requests and subsequent ID
  return reportArray;
};

const GetReportList = async (
  uid: string,
  reportParams: Array<{ [key: string]: string }>
) => {
  const batch = firebase.firestore().batch();

  for (let i = 0; i < reportParams.length; i++) {
    const amazonCred = await userCreds.getUserCreds(uid);
    const requestId = await amazonCred[reportParams.reportType].requestId;
    const reportId = await getReportRequestList(
      requestId,
      amazonCred,
      reportParams
    );
    const path = `users/${uid}`;
    let requestDetails = { ...amazonCred[reportParams.reportType], reportId };
    batch.set(
      firebase.firestore().doc(path),
      {
        [reportParams.reportType]: requestDetails,
      },
      { merge: true }
    );
  }
  batch.commit();
};

const GetReport = async (
  uid: string,
  reportParams: Array<{ [key: string]: string }>
): Promise<void> => {
  const batch = firebase.firestore().batch();
  const amazonCred = await userCreds.getUserCreds(uid);

  for (let i = 0; i < reportParams.length; i++) {
    const reportId = await amazonCred[reportParams[i].reportType].reportId;
    const requestData = await getReport(reportId, amazonCred, reportParams[i]);
    console.log('Found data');
    const data = requestData.data;

    //Check for which SKU key
    //TODO: Make this insto a switch statement
    let skuKey: string = '';
    if (data[0]['Merchant SKU']) {
      skuKey = 'Merchant SKU';
    } else if (data[0]['seller-sku']) {
      skuKey = 'seller-sku';
    } else {
      console.log('Unknown key for data');
    }

    const path = `users/${uid}/${reportParams[i].reportType}`;
    for (let j = 0; j < data.length; j++) {
      const sellerSku = data[j][skuKey];
      batch.set(firebase.firestore().doc(`${path}/${sellerSku}`), data[j], {
        merge: true,
      });
    }
  }
  batch.commit();
};

export { GetReportRequest, GetReportList, GetReport };
