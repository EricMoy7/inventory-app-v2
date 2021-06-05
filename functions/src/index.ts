import * as functions from 'firebase-functions';
import app from './express/express';
import {
  getReportRequest,
  getReportRequestList,
  getReport,
} from './amazon/lib/mws/getReportRequest';
import * as userCreds from './amazon/lib/userData/getUserCreds';
import firebase from './firebase/service';

// // Start writing Firebase Functions
// // https://firebase.google.com/docs/functions/typescript
//

exports.app = functions
  .runWith({ memory: '1GB', timeoutSeconds: 180 })
  .https.onRequest(app);

exports.scheduledReportRequest = functions.pubsub
  .schedule('0 * * * *')
  .timeZone('America/Chicago')
  .onRun(async (context) => {
    const userList = ['TIb07YIc9qgXsKf5DaFJvvWS7vg2'];
    const batch = firebase.firestore().batch();
    for (let i = 0; i < userList.length; i++) {
      const amazonCred = await userCreds.getUserCreds(userList[i]);
      const reportId = getReportRequest(
        {
          reportType: '_GET_FBA_FULFILLMENT_CURRENT_INVENTORY_DATA_',
          version: '2009-01-01',
        },
        amazonCred
      );
      const path = `users/${amazonCred.id}`;
      batch.set(
        firebase.firestore().doc(path),
        {
          reportCurrentFbaInventory: {
            reportId: reportId,
            time: Date.now(),
          },
        },
        { merge: true }
      );
    }
    await batch.commit();
    return null;
  });

exports.scheduledReportRequest = functions.pubsub
  .schedule('0 * * * *')
  .timeZone('America/Chicago')
  .onRun(async (context) => {
    const userList = ['TIb07YIc9qgXsKf5DaFJvvWS7vg2'];
    const batch = firebase.firestore().batch();
    for (let i = 0; i < userList.length; i++) {
      const amazonCred = await userCreds.getUserCreds(userList[i]);
      const reportId = getReportRequest(
        {
          reportType: '_GET_FBA_FULFILLMENT_CURRENT_INVENTORY_DATA_',
          version: '2009-01-01',
        },
        amazonCred
      );
      const path = `users/${amazonCred.id}`;
      batch.set(
        firebase.firestore().doc(path),
        {
          reportCurrentFbaInventory: {
            reportId: reportId,
            time: Date.now(),
          },
        },
        { merge: true }
      );
    }
    await batch.commit();
    return null;
  });

exports.test1 = functions.https.onRequest(async (req, res): Promise<void> => {
  const userList = ['TIb07YIc9qgXsKf5DaFJvvWS7vg2'];
  const batch = firebase.firestore().batch();

  const reportParams = {
    reportType: '_GET_RESTOCK_INVENTORY_RECOMMENDATIONS_REPORT_',
    version: '2009-01-01',
  };
  for (let i = 0; i < userList.length; i++) {
    const amazonCred = await userCreds.getUserCreds(userList[i]);
    const reportId = await getReportRequest(reportParams, amazonCred);
    console.log(reportId);
    const path = `users/${userList[i]}`;
    batch.set(
      firebase.firestore().doc(path),
      {
        [reportParams.reportType]: {
          requestId: reportId,
          time: Date.now(),
        },
      },
      { merge: true }
    );
  }
  await batch.commit();
  res.send('Done');
});

exports.test2 = functions.https.onRequest(async (req, res): Promise<void> => {
  const userList = ['TIb07YIc9qgXsKf5DaFJvvWS7vg2'];
  const batch = firebase.firestore().batch();

  const reportParams = {
    reportType: '_GET_RESTOCK_INVENTORY_RECOMMENDATIONS_REPORT_',
    version: '2009-01-01',
  };

  for (let i = 0; i < userList.length; i++) {
    const amazonCred = await userCreds.getUserCreds(userList[i]);
    const requestId = await amazonCred[reportParams.reportType].requestId;
    const reportId = await getReportRequestList(
      requestId,
      amazonCred,
      reportParams
    );
    const path = `users/${userList[i]}`;
    let requestDetails = { ...amazonCred[reportParams.reportType], reportId };
    console.log(requestDetails);
    batch.set(
      firebase.firestore().doc(path),
      {
        [reportParams.reportType]: requestDetails,
      },
      { merge: true }
    );
  }
  batch.commit();
  res.send('Finished');
});

exports.test3 = functions.https.onRequest(async (req, res): Promise<void> => {
  const batch = firebase.firestore().batch();
  const userList = ['TIb07YIc9qgXsKf5DaFJvvWS7vg2'];
  const reportParams = {
    reportType: '_GET_RESTOCK_INVENTORY_RECOMMENDATIONS_REPORT_',
    version: '2009-01-01',
  };

  for (let i = 0; i < userList.length; i++) {
    const amazonCred = await userCreds.getUserCreds(userList[i]);
    const reportId = await amazonCred[reportParams.reportType].reportId;
    const requestData = await getReport(reportId, amazonCred, reportParams);
    console.log('Found data');
    const data = requestData.data;

    //Check for which SKU key
    //TODO: Make this insto a switch statement
    let skuKey;
    if (data[0]['Merchant SKU']) {
      skuKey = 'Merchant SKU';
    } else if (data[0]['seller-sku']) {
      skuKey = 'seller-sku';
    } else {
      console.log('Unknown key for data');
      break;
    }

    console.log('Found sku header');

    const path = `users/${userList[i]}/${reportParams.reportType}`;
    for (let j = 0; j < data.length; j++) {
      const sellerSku = data[j][skuKey];
      batch.set(firebase.firestore().doc(`${path}/${sellerSku}`), data[j], {
        merge: true,
      });
    }
    batch.commit();
    res.send('Finished');
  }
});
