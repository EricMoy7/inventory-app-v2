import { getReportTypes } from '../lib/mws/getReportTypes';
import { getListofUserIds } from '../lib/userData/getListOfUserIds';
import firebase from '../../firebase/service';

export const reportTasks = async (reportState: string): Promise<void> => {
  const listOfIds = await getListofUserIds();
  const Timestamp = firebase.firestore.Timestamp;

  const promiseStack = [];
  const timeInSeconds = Date.now() / 1000;
  for (let userId of listOfIds) {
    console.log(`Setting ${typeof reportState} for ${userId}`);
    const reportTypes = await getReportTypes(userId);
    const promise = new Promise(async (resolve, reject) => {
      let factor;
      switch (reportState) {
        case 'requestReportTask':
          factor = 0;
          break;
        case 'requestReportListTask':
          factor = 300;
          break;
        case 'getReportTask':
          factor = 600;
          break;
        default:
          factor = 0;
      }

      for (let i = 0; i < 24; i++) {
        const scheduledTime = Math.round(
          timeInSeconds + (i / 24) * 86400 + factor
        );
        let reportParams: any[] = [];
        for (let j = 0; j < reportTypes.length; j++) {
          reportParams.push({
            reportType: reportTypes[j],
            version: '2009-01-01',
          });
        }

        await firebase
          .firestore()
          .collection(`tasks`)
          .add({
            performAt: new Timestamp(scheduledTime, 0),
            status: 'scheduled',
            worker: reportState,
            options: {
              uid: userId,
              reportParams,
            },
          });
      }
      resolve('Done');
    });
    promiseStack.push(promise);
  }
  await Promise.all(promiseStack).then((results) => console.log(results));
};
