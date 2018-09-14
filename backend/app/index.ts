import express =  require('express');
import config from './config';

const { SERVER_PORT } = config;

const app = express();

app.get('/', (req, res) => res.send('Hello World!'));

app.listen(SERVER_PORT, () => {
    debugger;
    const a = 'hi';
    console.log(`Running server on port ${SERVER_PORT}`);
});
