import firebase from '../../../firebase/service';
import { UserCredentials } from '../../../types';

export const createUserCreds = async (
  uid: string,
  sellerId: string,
  mwsAuthToken: string
): Promise<UserCredentials> => {
  console.log({ sellerId, mwsAuthToken });
  await firebase.firestore().doc(`users/${uid}`).set(
    {
      sellerId,
      mwsAuthToken,
    },
    { merge: true }
  );
  const data = { uid, sellerId, mwsAuthToken };
  return data;
};
