import { crawling } from '../crawlers/init';

export const getHome = async (req, res) => {
    res.send('Welcome! naver-price-watcher!');
    //await crawling();
};
