import getProductData from '../lib/mws/getProductData';
import * as userCreds from '../lib/userData/getUserCreds';

import firebase from '../../firebase/service';

const forceInventoryImageUpdate = async (uid: string): Promise<void> => {
  const amazonCred = await userCreds.getUserCreds(uid);
  const db = firebase.firestore();
  const batch = db.batch();

  await db
    .collection(`users/${uid}/inventory/`)
    .get()
    .then(async (snapshot) => {
      for (let doc of snapshot.docs) {
        const productAsin = doc.data().asin;
        const productData = await getProductData(productAsin, amazonCred);
        batch.update(db.doc(`users/${uid}/inventory/${doc.id}`), productData);
      }

      return null;
    })
    .then(() => {
      return batch.commit();
    });
};

const emptyInventoryImageUpdate = async (uid: string): Promise<void> => {
  const amazonCred = await userCreds.getUserCreds(uid);
  const db = firebase.firestore();
  const batch = db.batch();

  await db
    .collection(`users/${uid}/inventory/`)
    .where('imageUrl', '==', null)
    .get()
    .then(async (snapshot) => {
      for (let doc of snapshot.docs) {
        const productAsin = doc.data().asin;
        const productData = await getProductData(productAsin, amazonCred);
        batch.update(db.doc(`users/${uid}/inventory/${doc.id}`), productData);
      }

      return null;
    })
    .then(() => {
      return batch.commit();
    });
};

export { forceInventoryImageUpdate, emptyInventoryImageUpdate };
