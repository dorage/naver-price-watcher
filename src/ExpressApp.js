import express from 'express';
import helmet from 'helmet';
import bodyParser from 'body-parser';
import session from 'express-session';
import swaggerUI from 'swagger-ui-express';

import './db';
import mainRouter from './routers/mainRouter';
import productRouter from './routers/productRouter';
import './configs/crawler';
import { dotenvConfigs } from './configs/dotenv';
import { swaggerSpec } from './configs/swagger';
import morgan from 'morgan';

const app = express();

app.use(helmet());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(
    session({
        secret: dotenvConfigs.cookieSecret,
        resave: true,
        saveUninitialized: false,
    }),
);
app.use(morgan('dev'));

app.use(mainRouter);
app.use('/products', productRouter);
app.use(
    '/api-docs',
    swaggerUI.serve,
    swaggerUI.setup(swaggerSpec, { explorer: true }),
);

export default app;
