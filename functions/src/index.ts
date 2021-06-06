import * as functions from 'firebase-functions';
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
      helloWorld: function () {
        return firebase.firestore().collection('logs').add({ hello: 'world' });
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
