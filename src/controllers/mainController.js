import { getRedirectURL } from '../crawlers/init';

export const getHome = async (req, res) => {
    res.send('Welcome! naver-price-watcher!');
};

export const getTest = async (req, res) => {
    await getRedirectURL();
    res.send('TESTING API!!');
};
