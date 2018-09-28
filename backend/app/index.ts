import express = require('express');

import config from './config';
import DatabaseUtil from './utility/DatabaseUtil';
import { router } from './routes';

import { injectUser } from './utility/AuthUtil';

const { SERVER_PORT } = config;

const app = express();

app.use(express.json());
app.use(injectUser);
app.use(router);

app.get('/', (req, res) => res.send('Hello World!'));

app.get('/db-test', async (req, res) => {
    const accounts = await DatabaseUtil.sendQuery('SELECT * FROM ACCOUNT');
    return res.send(accounts);
});

app.listen(SERVER_PORT, () => {
    console.log(`Running server on port ${SERVER_PORT}`);
});
