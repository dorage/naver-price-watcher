import './configs';
import app from './ExpressApp';
import { configs } from './configs';

const port = configs.port;

const handleListen = () => {
    console.log(`Listening On : http://localhost:${port}`);
};

app.listen(port, handleListen);
