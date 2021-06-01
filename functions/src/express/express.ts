import credentials from '../amazon/functions/credentials';
import { UserCredentials, Data, ActiveListingsReport } from '../types';
import * as report from '../amazon/functions/getReport';
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
  '/report/getReport',
  async (req: express.Request, res: express.Response): Promise<void> => {
    const { uid, version, reportType } = req.query as Data;
    try {
      const data = await report.getReport(uid, reportType, version);
      res.send(data);
    } catch (err) {
      console.log(err);
    }
  }
);

app.get(
  '/report/updateActiveList',
  async (req: express.Request, res: express.Response): Promise<void> => {
    const { uid } = req.query as Data;
    const reportType = '_GET_MERCHANT_LISTINGS_DATA_';
    const version = '2009-01-01';

    try {
      let data = (await report.getReport(
        uid,
        reportType,
        version
      )) as ActiveListingsReport;
      await report.setActiveListings(uid, data);
      res.send('Active Listings Updated!');
    } catch (err) {
      console.log(err);
    }
  }
);

export default app;
