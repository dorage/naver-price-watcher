import Product from '../models/Product';
export const getHome = async (req, res) => {
    res.send('Welcome! naver-price-watcher!');
};

export const getTest = async (req, res) => {
    res.send('TESTING API!!');
};
