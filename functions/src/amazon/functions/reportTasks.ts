import { getReportParams } from '../lib/mws/getReportParams';
import { getListofUserIds } from '../lib/userData/getListOfUserIds';
import firebase from '../../firebase/service';

export const reportTasks = async (): Promise<void> => {
  const listOfIds = await getListofUserIds();
  const Timestamp = firebase.firestore.Timestamp;

  const promiseStack = [];
  const timeInSeconds = Date.now() / 1000;
  for (let userId of listOfIds) {
    const reportParams = await getReportParams(userId);
    const promise = new Promise(async (resolve, reject) => {
      for (let i = 0; i < 24; i++) {
        const scheduledTime = Math.round(timeInSeconds + (i / 24) * 86400);
        await firebase
          .firestore()
          .collection(`tasks`)
          .add({
            performAt: new Timestamp(scheduledTime, 0),
            status: 'scheduled',
            worker: 'report',
            options: {
              reportType: reportParams,
              version: '2009-01-01',
            },
          });
      }
      resolve('Done');
    });
    promiseStack.push(promise);
  }
  await Promise.all(promiseStack);
};
