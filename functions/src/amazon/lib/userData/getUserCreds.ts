import firebase from '../../../firebase/service'

export const getUserCreds = async ( uid: string ): Promise<FirebaseFirestore.DocumentData> => {
    const credsObj = await firebase.firestore().doc(`users/${uid}`).get()
    const creds = credsObj.data
    return creds
}