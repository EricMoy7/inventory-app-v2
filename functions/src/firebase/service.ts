import * as firebase from 'firebase-admin';
import { ServiceAccount } from 'firebase-admin';
import * as credentials from './credentials.json';

firebase.initializeApp({
  credential: firebase.credential.cert(credentials as ServiceAccount),
});

export default firebase;
