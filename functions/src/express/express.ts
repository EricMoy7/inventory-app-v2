import credentials from '../amazon/functions/credentials';
import { UserCredentials, Data } from '../types';
import {
  GetReport,
  GetReportList,
  GetReportRequest,
} from '../amazon/functions/getReport';

import express = require('express');
import cors = require('cors');
// import { reportTasks } from '../amazon/functions/reportTasks';

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
      const listOfRequestIds = await GetReportRequest(uid, arrayParams);
      res.send(listOfRequestIds);
    } catch (err) {
      console.log(err);
    }
  }
);

app.get(
  '/report/getReportRequestList',
  async (req: express.Request, res: express.Response): Promise<void> => {
    const { uid } = req.query as Data;
    let reportParams = req.query.reportParams as string;

    const arrayParams = JSON.parse(reportParams);

    try {
      const listOfIds = await GetReportList(uid, arrayParams);
      res.send(listOfIds);
    } catch (err) {
      console.log(err);
    }
  }
);

app.get(
  '/report/getReport',
  async (req: express.Request, res: express.Response): Promise<void> => {
    const { uid } = req.query as Data;
    let reportParams = req.query.reportParams as string;

    const arrayParams = JSON.parse(reportParams);

    try {
      await GetReport(uid, arrayParams);
      res.sendStatus(200);
    } catch (err) {
      console.log(err);
    }
  }
);

// app.get(
//   '/report/setTasks',
//   async (req: express.Request, res: express.Response): Promise<void> => {
//     try {
//       await reportTasks();
//       res.sendStatus(201);
//     } catch (err) {
//       console.log(err);
//     }
//   }
// );

//CSV Uploader Function
app.post(
  '/upload/inventory',
  async (req: express.Request, res: express.Response): Promise<void> => {
    try {
      res.sendStatus(200);
    } catch (err) {
      console.log(err);
    }
  }
);

export default app;
