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
