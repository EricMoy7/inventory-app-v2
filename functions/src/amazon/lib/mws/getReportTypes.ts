import firebase from '../../../firebase/service';

export const getReportTypes = async (uid: string): Promise<Array<string>> => {
  const snapshot = await firebase
    .firestore()
    .collection(`users/${uid}/reportIdentifiers`)
    .get();
  return snapshot.docs.map((doc) => doc.id);
};
