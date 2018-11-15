import server from './server';
import config from './config';

import { User } from './models';

const { SERVER_PORT } = config;

declare global {
    namespace Express {
        export interface Request {
            user?: User;
        }
    }
}

server.listen(SERVER_PORT, () => {
    console.log(`Running server on port ${SERVER_PORT}`);
});
