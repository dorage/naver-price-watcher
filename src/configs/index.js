import dotenv from 'dotenv';
import path from 'path';

// dotenv setting
let loadedDotEnv;

switch (process.env.NODE_ENV) {
    case 'development':
        loadedDotEnv = dotenv.config({
            path: path.join(__dirname, '../../.env.development'),
        });
        break;
    case 'production':
        loadedDotEnv = dotenv.config({
            path: path.join(__dirname, '../../.env.production'),
        });
        break;
    default:
        throw new Error('process.env.NODE_ENV 가 설정되지 않았습니다.');
}
if (loadedDotEnv.error) {
    throw loadedDotEnv.error;
}

// type casting fns
const number = (value) => {
    const result = Number(value);
    if (!Number.isNaN(result)) return result;
};
const string = (value) => value;

const typeConverter = { string, number };

const cast = (key, type, defaultValue) => {
    const value = process.env[key];
    if (value !== undefined) {
        const result = typeConverter[type](value);
        if (result !== undefined) {
            return result;
        }
        throw new Error(
            `process.env.${key}에 적절한 값이 설정되지 않았습니다.`,
        );
    }
    if (process.env.NODE_ENV === 'production') {
        throw new Error(`process.env.${key}에 값이 설정되지 않았습니다.`);
    }
    if (defaultValue !== undefined) {
        return defaultValue;
    }
    throw new Error(`process.env.${key}에 할당할 값이 없습니다.`);
};

export const configs = {
    port: cast('PORT', 'number', '4000'),
    mongoUrl: cast(
        'MONGO_URL',
        'string',
        'mongodb://127.0.0.1:27017/boilerplate',
    ),
    cookieSecret: cast('COOKIE_SECRET', 'string', 'boilerplate'),
    clientURL: cast('CLIENT_URL', 'string', 'http://localhost:4000'),
    serverURL: cast('CLIENT_URL', 'string', 'http://localhost:3000'),
};
