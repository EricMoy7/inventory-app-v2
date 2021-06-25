import * as functions from 'firebase-functions';
import {
  GetReportList,
  GetReport,
  GetReportRequest,
} from './amazon/functions/getReport';
import { reportTasks } from './amazon/functions/reportTasks';
import app from './express/express';
import firebase from './firebase/service';

// // Start writing Firebase Functions
// // https://firebase.google.com/docs/functions/typescript
//

exports.app = functions
  .runWith({ memory: '1GB', timeoutSeconds: 180 })
  .https.onRequest(app);

interface Workers {
  [key: string]: (options: any) => Promise<any>;
}

exports.taskRunner = functions
  .runWith({ memory: '2GB' })
  .pubsub.schedule('*/5 * * * *')
  .onRun(async (context) => {
    const now = firebase.firestore.Timestamp.now();

    const query = firebase
      .firestore()
      .collection('tasks')
      .where('performAt', '<=', now)
      .where('status', '==', 'scheduled');

    const tasks = await query.get();

    const jobs: Promise<any>[] = [];

    const workers: Workers = {
      helloWorld() {
        return firebase.firestore().collection('logs').add({ hello: 'world' });
      },
      requestReportTask(options) {
        console.log(options);
        return GetReportRequest(options.uid, options.reportParams);
      },
      requestReportListTask(options) {
        console.log(options);
        return GetReportList(options.uid, options.reportParams);
      },
      getReportTask(options) {
        console.log(options);
        return GetReport(options.uid, options.reportParams);
      },
    };

    tasks.forEach((snapshot) => {
      const { worker, options } = snapshot.data();

      const job = workers[worker](options)
        .then(() => snapshot.ref.update({ status: 'complete' }))
        .catch(() => snapshot.ref.update({ status: 'error' }));

      jobs.push(job);
    });
  });

// Look for a better way to write this promise stack
exports.requestReportScheduler = functions.pubsub
  .schedule('0 0 * * *')
  .onRun((context) => {
    const p1 = new Promise(async (resolve, reject) => {
      await reportTasks('requestReportTask');
      resolve('Success');
    });
    const p2 = new Promise(async (resolve, reject) => {
      await reportTasks('requestReportListTask');
      resolve('Success');
    });
    const p3 = new Promise(async (resolve, reject) => {
      await reportTasks('getReportTask');
      resolve('Success');
    });

    return Promise.all([p1, p2, p3]);
  });

// exports.test = functions.https.onRequest((req, res) => {
//   const p1 = new Promise(async (resolve, reject) => {
//     await reportTasks('requestReportTask');
//     resolve('Success');
//   });

//   const p2 = new Promise(async (resolve, reject) => {
//     await reportTasks('requestReportListTask');
//     resolve('Success');
//   });

//   const p3 = new Promise(async (resolve, reject) => {
//     await reportTasks('getReportTask');
//     resolve('Success');
//   });

//   Promise.all([p1, p2, p3]).then((result) => res.sendStatus(200));
// });
