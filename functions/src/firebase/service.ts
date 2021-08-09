import * as firebase from 'firebase-admin';

const params = {
  type: process.env.FUNCTIONS_TYPE,
  projectId: process.env.FUNCTIONS_PROJECT_ID,
  privateKeyId: process.env.FUNCTIONS_PRIVATE_KEY_ID,
  privateKey: process.env.FUNCTIONS_PRIVATE_KEY,
  clientEmail: process.env.FUNCTIONS_CLIENT_EMAIL,
  clientId: process.env.FUNCTIONS_CLIENT_ID,
  authUri: process.env.FUNCTIONS_AUTH_URI,
  tokenUri: process.env.FUNCTIONS_TOKEN_URI,
  authProviderX509CertUrl: process.env.FUNCTIONS_AUTH_PROVIDER,
  clientC509CertUrl: process.env.FUNCTIONS_CLIENT_CERT_URL,
};

firebase.initializeApp({
  credential: firebase.credential.cert(params),
});

export default firebase;
