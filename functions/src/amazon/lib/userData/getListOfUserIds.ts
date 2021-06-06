import firebase from '../../../firebase/service';

export const getListofUserIds = async (): Promise<Array<string>> => {
  const snapshot = await firebase.firestore().collection('users').get();
  return snapshot.docs.map((doc) => doc.id);
};
