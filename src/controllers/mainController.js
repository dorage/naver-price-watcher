<<<<<<< HEAD
import { crawling } from '../crawlers/init';
=======
import puppeteer from 'puppeteer';
import Sequence from '../models/Sequence';
import Product from '../models/Product';
import Seller from '../models/Seller';
import { crawl } from '../crawlers/init';
>>>>>>> 1528449be65435bfb6ed4b8dd96e81dbca3b2285

export const getHome = async (req, res) => {
    res.send('Welcome! naver-price-watcher!');
    //await crawling();
};

export const postUpdate = (req, res) => {
    crawl();
    res.send('done! thanks!');
}