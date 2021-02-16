import Product from '../models/Product';
export const getHome = async (req, res) => {
    res.send('Welcome! naver-price-watcher!');
};

export const getTest = async (req, res) => {
    res.send('TESTING API!!');
    const products = await Product.find();
    const set = new Set(products.map((elem) => elem.mall));
    [...set].forEach((elem) => console.log(elem));
};
