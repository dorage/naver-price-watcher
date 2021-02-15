import { getRedirectURL } from '../crawlers/init';
import {
    getAuctionCode,
    getWemapPdtCode,
    getLotteOnPdtCode,
    getKShoppingPdtCode,
    getLFMallPdtCode,
    getLotteIMallPdtCode,
    getNSMallPdtCode,
    getGSShopPdtCode,
    getGongYoungPdtCode,
    getCJMallPdtCode,
    getSKStoaPdtCode,
    getLotteDepartmentPdtCode,
    getHomeAndShoppingPdtCode,
    getHmallPdtCode,
} from '../crawlers/mallActions';

export const getHome = async (req, res) => {
    res.send('Welcome! naver-price-watcher!');
};

export const getTest = async (req, res) => {
    const url =
        'https://www.hmall.com/p/pda/itemPtc.do?ReferCode=429&slitmCd=2121448944&utm_source=naver&utm_medium=cps_pcs&utm_campaign=sale&NaPm=ct%3Dkl6juahc%7Cci%3D7caffd4fd457c06cae9e750eb3edbaa767a36f0a%7Ctr%3Dslsl%7Csn%3D14%7Chk%3D70b7f33aac96a7451f79e5c0c76d31f45bd20577';
    console.log(getHmallPdtCode(url));
    res.send('TESTING API!!');
};
