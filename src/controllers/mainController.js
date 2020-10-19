import puppeteer from 'puppeteer';
import Sequence from '../models/Sequence';
import Product from '../models/Product';
import Seller from '../models/Seller';

export const getHome = (req, res) => {
    res.send('Welcome! naver-price-watcher!');
};

export const getLatest = async (req, res) => {
    const lastSequence = await Sequence.findOne({ processing: false }).sort({
        _id: -1,
    });
    if (lastSequence == null) res.send('processing...');
    const sellers = await Seller.find({}, { __v: 0 });
    const response = [];
    for (var seller of sellers) {
        const products = await Product.find(
            { sequence: lastSequence, seller },
            { _id: 0, sequence: 0, seller: 0, product_model: 0, __v: 0 },
        );
        let unit_sales = 0;
        if (products.length) {
            for (var product of products) unit_sales += product.unit_sales;
        }
        response.push({
            seller: seller.name,
            unit_sales: unit_sales,
            products: products,
        });
    }
    res.send(response);
};
