import express from 'express';
import helmet from 'helmet';
import bodyParser from 'body-parser';
import session from 'express-session';
import swaggerUI from 'swagger-ui-express';

import './db';
import mainRouter from './routers/mainRouter';
import './configs/crawler';
import { dotenvConfigs } from './configs/dotenv';
import { swaggerSpec } from './configs/swagger';
import morgan from 'morgan';
import {
    initializeProduct,
    initializeSellers,
    initializeVendors,
} from './middlewares/initializeMiddleware';

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

/// initialize Models // TODO; API로 등록하게 옮기기
//initializeVendors();
//initializeSellers();
initializeProduct();

app.use(mainRouter);
app.use(
    '/api-docs',
    swaggerUI.serve,
    swaggerUI.setup(swaggerSpec, { explorer: true }),
);

export default app;
