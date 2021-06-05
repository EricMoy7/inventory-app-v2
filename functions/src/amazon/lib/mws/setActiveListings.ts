import { ActiveListingsReport, Data, UserCredentials } from '../../../types';
import firebase from '../../../firebase/service';

const setActiveListings = async (
  uid: string,
  data: ActiveListingsReport,
  amazonCred: UserCredentials,
  productDetails: Function
): Promise<void> => {
  const dataList = data.data as Data[];
  const batch = firebase.firestore().batch();
  const path = `users/${uid}/activeAmazonInventory`;
  for (let i = 0; i < dataList.length; i++) {
    console.log(`Getting product details for: ${dataList[i].asin1}`);
    const productData = await productDetails(dataList[i].asin1, amazonCred);
    batch.set(
      firebase.firestore().doc(`${path}/${dataList[i]['seller-sku']}`),
      { ...dataList[i], ...productData }
    );
  }
  await batch.commit();
};

export default setActiveListings;
