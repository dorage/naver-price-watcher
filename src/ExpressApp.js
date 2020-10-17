import express from 'express';
import helmet from 'helmet';
import bodyParser from 'body-parser';
import session from 'express-session';
import swaggerUI from 'swagger-ui-express';

import './db';
import mainRouter from './routers/mainRouter';
import { configs } from './configs';
import morgan from 'morgan';
import { swaggerSpec } from './configs/swagger';

const app = express();

app.use(helmet());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(
    session({
        secret: configs.cookieSecret,
        resave: true,
        saveUninitialized: false,
    }),
);
app.use(morgan('dev'));

app.use(mainRouter);
app.use(
    '/api-docs',
    swaggerUI.serve,
    swaggerUI.setup(swaggerSpec, { explorer: true }),
);

export default app;
