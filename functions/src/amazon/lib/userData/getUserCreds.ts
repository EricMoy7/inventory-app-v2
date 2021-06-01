import firebase from '../../../firebase/service';
import { UserCredentials } from '../../../types';

export const getUserCreds = async (uid: string): Promise<UserCredentials> => {
  const credsObj = await firebase.firestore().doc(`users/${uid}`).get();
  const creds = credsObj.data() as UserCredentials;
  return creds;
};
