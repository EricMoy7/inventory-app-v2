import credentials from '../amazon/functions/credentials';
import { UserCredentials } from '../types';

const express = require('express');
const cors = require('cors');

const app = express();

app.use(cors({ origin: true}));

app.post('/createUserCreds', async (req: any, res: any): Promise<void> => {
    res.set("Access-Control-Allow-Origin", "*");
    res.set("Access-Control-Allow-Methods", "POST");
    
    const payload = req.body as UserCredentials;
    const { uid, sellerId, mwsAuthToken } = payload;
    console.log({uid, sellerId, mwsAuthToken})
    
    try {
        await credentials.createUserCreds(uid, sellerId, mwsAuthToken);
        res.sendStatus( 201 )
    } catch (err) {
        console.log(err)
        res.sendStatus( 400 )
    }
} )

export default app
