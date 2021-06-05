import credentials from '../amazon/functions/credentials';
import { UserCredentials, Data } from '../types';
import { GetReport } from '../amazon/functions/getReport';

import express = require('express');
import cors = require('cors');

const app = express();
app.use(cors());

app.post(
  '/createUserCreds',
  async (req: express.Request, res: express.Response): Promise<void> => {
    const payload = req.body as UserCredentials;
    const { uid, sellerId, mwsAuthToken } = payload;
    console.log(payload);

    try {
      await credentials.createUserCreds(uid, sellerId!, mwsAuthToken!);
      res.sendStatus(201);
    } catch (err) {
      console.log(err);
    }
  }
);

app.get(
  '/getUserCreds',
  async (req: express.Request, res: express.Response): Promise<void> => {
    const { uid } = req.query as Data;

    try {
      const data = await credentials.getUserCreds(uid);
      if (!data) {
        res.send('No data. UID was probably not sent.');
      }
      res.send(data);
    } catch (err) {
      console.log(err);
    }
  }
);

app.get(
  '/report/getReportRequest',
  async (req: express.Request, res: express.Response): Promise<void> => {
    const { uid } = req.query as Data;
    let reportParams = req.query.reportParams as string;

    const arrayParams = JSON.parse(reportParams);

    try {
      const listOfRequestIds = await GetReport(uid, arrayParams);
      res.send(listOfRequestIds);
    } catch (err) {
      console.log(err);
    }
  }
);

export default app;
