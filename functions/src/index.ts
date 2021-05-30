import * as functions from "firebase-functions";
import app from "./express/express";

// // Start writing Firebase Functions
// // https://firebase.google.com/docs/functions/typescript
//

exports.app = functions.https.onRequest(app);
