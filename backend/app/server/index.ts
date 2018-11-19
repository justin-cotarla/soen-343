import express = require('express');

import DatabaseUtil from '../utility/DatabaseUtil';
import { router } from '../controllers';

import injectUser from '../middlewares/injectUser';
import { User } from '../models';

declare global {
    namespace Express {
        export interface Request {
            user?: User;
        }
    }
}

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
