import mongoose from 'mongoose';
import { configs } from './configs';

mongoose.connect(configs.mongoUrl, {
    useNewUrlParser: true,
    useFindAndModify: false,
    useUnifiedTopology: true,
});

const db = mongoose.connection;
const url = configs.mongoUrl;

const handleError = (error) => console.log(`error: ${error}`);
const handleOpen = () => console.log(`DB Connected on ${url}`);

db.on('error', handleError);
db.once('open', handleOpen);
