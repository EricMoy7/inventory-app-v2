import firebase from '../../../firebase/service'

export const createUserCreds = async ( uid: string, sellerId: string, mwsAuthToken: string): Promise<void> => {
    
    try {
        await firebase.firestore().doc(`users/${uid}`).set({
            sellerId,
            mwsAuthToken
        }, { merge: true }
        );
    } catch (err) {
        console.log(err);
    }
}