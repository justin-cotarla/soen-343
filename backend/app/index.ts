import server from './server';
import config from './config';

const { SERVER_PORT } = config;

server.listen(SERVER_PORT, () => {
    console.log(`Running server on port ${SERVER_PORT}`);
});
