import './configs/dotenv';
import app from './ExpressApp';
import { dotenvConfigs } from './configs/dotenv';

const port = dotenvConfigs.port;

const handleListen = () => {
    console.log(`Listening On : http://localhost:${port}`);
};

app.listen(port, handleListen);
