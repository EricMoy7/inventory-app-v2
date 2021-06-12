import { getReportParams } from '../lib/mws/getReportParams';
import { getListofUserIds } from '../lib/userData/getListOfUserIds';
import firebase from '../../firebase/service';

export const reportTasks = async (reportState: string): Promise<void> => {
  const listOfIds = await getListofUserIds();
  const Timestamp = firebase.firestore.Timestamp;

  const promiseStack = [];
  const timeInSeconds = Date.now() / 1000;
  for (let userId of listOfIds) {
    const reportParams = await getReportParams(userId);
    const promise = new Promise(async (resolve, reject) => {
      let i = 0;
      if (reportState === 'requestReportTask') {
        i = 0;
      } else if (reportState === 'requestReportListTask') {
        i = 300;
      } else if (reportState === 'getReportTask') {
        i = 600;
      } else {
        console.log('Unknown reportState.');
      }
      for (i; i < 24; i++) {
        const scheduledTime = Math.round(timeInSeconds + (i / 24) * 86400);
        let options: { [key: string]: any } = {
          uid: userId,
          reportType: reportParams,
          version: '2009-01-01',
        };
        await firebase
          .firestore()
          .collection(`tasks`)
          .add({
            performAt: new Timestamp(scheduledTime, 0),
            status: 'scheduled',
            worker: reportState,
            options,
          });
      }
      resolve('Done');
    });
    promiseStack.push(promise);
  }
  await Promise.all(promiseStack);
};
