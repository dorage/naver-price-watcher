import mongoose from 'mongoose';
import { dotenvConfigs } from './configs/dotenv';

mongoose.connect(dotenvConfigs.mongoUrl, {
    useNewUrlParser: true,
    useFindAndModify: false,
    useUnifiedTopology: true,
});

const db = mongoose.connection;
const url = dotenvConfigs.mongoUrl;

const handleError = (error) => console.log(`error: ${error}`);
const handleOpen = () => console.log(`DB Connected on ${url}`);

db.on('error', handleError);
db.once('open', handleOpen);
