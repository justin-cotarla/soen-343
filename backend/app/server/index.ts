import express = require('express');

import DatabaseUtil from '../utility/DatabaseUtil';
import { router } from '../controllers';

import { injectUser } from '../utility/AuthUtil';

const app = express();

app.use(express.json());
app.use(injectUser);
app.use(router);

app.get('/', (req, res) => res.send('Hello World!'));

app.get('/db-test', async (req, res) => {
    const accounts = await DatabaseUtil.sendQuery('SELECT * FROM USER');
    return res.send(accounts);
});

export default app;
