import { ActiveListingsReport, Data } from '../../../types';
import firebase from '../../../firebase/service';

const setActiveListings = async (
  uid: string,
  data: ActiveListingsReport
): Promise<void> => {
  const dataList = data.data as Data[];
  const batch = firebase.firestore().batch();
  const path = `users/${uid}/activeAmazonInventory`;
  for (let i = 0; i < dataList.length; i++) {
    batch.set(
      firebase.firestore().doc(`${path}/${dataList[i]['seller-sku']}`),
      dataList[i]
    );
  }
  await batch.commit();
};

export default setActiveListings;
