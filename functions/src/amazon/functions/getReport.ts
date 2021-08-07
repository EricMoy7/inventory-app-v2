import {
  getReportRequest,
  getReportRequestList,
  getReport,
} from '../lib/mws/getReportRequest';
import getProductData from '../lib/mws/getProductData';
import * as userCreds from '../lib/userData/getUserCreds';
import firebase from '../../firebase/service';
import { ReportIdData } from '../../types';

const GetReportRequest = async (
  uid: string,
  reportParams: Array<ReportIdData>
  //TODO: create interface for return type
): Promise<Array<ReportIdData>> => {
  const batch = firebase.firestore().batch();

  let reportArray: Array<ReportIdData> = [];

  //Get user data from DB
  const amazonCred = await userCreds.getUserCreds(uid);

  for (let i = 0; i < reportParams.length; i++) {
    //Get requestId from amazon mws api
    const requestId = await getReportRequest(reportParams[i], amazonCred);

    //Setup data to return to user
    const reportData = {
      reportType: reportParams[i].reportType,
      requestId,
    };
    reportArray = [...reportArray, reportData];

    //Set document DB path
    const path = `users/${uid}/reportIdentifiers/${reportData.reportType}`;

    //Setup batch for each item of reportParams with Request details
    batch.set(
      firebase.firestore().doc(path),
      { requestId: requestId, requestIdTime: Date.now() },
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
  reportParams: Array<ReportIdData>
): Promise<Array<ReportIdData>> => {
  //Initializes firestore batch
  const batch = firebase.firestore().batch();

  let reportArray: Array<ReportIdData> = [];

  //Begin looping through multiple report types
  for (let i = 0; i < reportParams.length; i++) {
    //Get amazon and user data
    const amazonCred = await userCreds.getUserCreds(uid);

    //Set report Identifiers tab for user
    const path = `users/${uid}/reportIdentifiers/${reportParams[i].reportType}`;

    //Get the request ID from DB that was generated with getReportRequest
    const reportDoc = await firebase.firestore().doc(path).get();
    const requestId = reportDoc.data()!.requestId;

    //Get the report ID from MWS
    const reportId = await getReportRequestList(
      requestId,
      amazonCred,
      reportParams[i]
    );

    //List of report objects for user response
    const reportData = {
      reportType: reportParams[i].reportType,
      requestId,
      reportId,
    };
    reportArray = [...reportArray, reportData];

    //Set new reportId values in database
    batch.set(
      firebase.firestore().doc(path),
      {
        reportId: reportId,
        reportIdTime: Date.now(),
      },
      { merge: true }
    );
  }

  batch.commit();
  return reportArray;
};

const GetReport = async (
  uid: string,
  reportParams: Array<ReportIdData>
): Promise<void> => {
  const batch = firebase.firestore().batch();

  //Get user data from DB
  const amazonCred = await userCreds.getUserCreds(uid);

  for (let i = 0; i < reportParams.length; i++) {
    const path = `users/${uid}/reportIdentifiers/${reportParams[i].reportType}`;

    const reportDoc = await firebase.firestore().doc(path).get();
    const reportId = reportDoc.data()!.reportId;

    const requestData = await getReport(reportId, amazonCred, reportParams[i]);
    const data = requestData.data;

    //Check for which SKU key
    //TODO: Make this into a switch statement
    //TODO: What if they don't exist throw this into its own function
    // and make a try catch
    let skuKey: string = '';
    if (data[0]['Merchant SKU']) {
      skuKey = 'Merchant SKU';
    } else if (data[0]['seller-sku']) {
      skuKey = 'seller-sku';
    } else if (data[0]['sku']) {
      skuKey = 'sku';
    } else {
      console.log('SKU KEY NOT FOUND');
    }

    let asinKey: string = '';
    if (data[0]['ASIN']) {
      asinKey = 'ASIN';
    } else if (data[0]['asin']) {
      asinKey = 'asin';
    } else {
      console.log('ASIN KEY NOT FOUND');
    }

    const snap = await firebase
      .firestore()
      .collection(`users/${uid}/${reportParams[i].reportType}`)
      .get();
    snap.docs.forEach(async (doc) => {
      await firebase
        .firestore()
        .doc(`users/${uid}/${reportParams[i].reportType}/${doc.id}`)
        .delete();
    });

    for (let j = 0; j < data.length; j++) {
      const sellerSku = data[j][skuKey];
      //Attach URL data to outbound JSON package
      const productData = await getProductData(data[j][asinKey], amazonCred);
      const mergedData = { ...productData, ...data[j] };
      batch.set(
        firebase
          .firestore()
          .doc(`users/${uid}/${reportParams[i].reportType}/${sellerSku}`),
        mergedData,
        {
          merge: true,
        }
      );
    }
  }
  await batch.commit();
};

export { GetReportRequest, GetReportList, GetReport };
