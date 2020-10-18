import Vendor from '../models/Vendor';
import Seller from '../models/Seller';
import ProductModel from '../models/ProductModel';

const companyInfo = {
    LJU: ['LJU', '제이마크글로벌', '케이페이지', '엘라비스'],
    드림빌: ['드림빌', '마루파트너', '파란아이앤티'],
    유플렉스: ['유플렉스'],
};
const productInfo = [
    { name: 'KRM-653', price: 319000 },
    { name: 'KRM-652', price: 299000 },
    { name: 'KRM-651', price: 279000 },
    { name: 'KRM-632', price: 279000 },
    { name: 'KRM-631', price: 259000 },
    { name: 'EM-873', price: 279000 },
    { name: 'EM-871', price: 259000 },
    { name: 'EM-322', price: 238000 },
    { name: 'EM-321', price: 218000 },
];

export const initializeVendors = async () => {
    try {
        if (await Vendor.countDocuments()) return;

        const vendors = Object.keys(companyInfo);
        const promise = vendors.map((name) => {
            const vendor = new Vendor({ name });
            vendor.save();
        });
        await Promise.all(promise);
    } catch (err) {
        console.log(err);
    }
};

export const initializeSellers = async () => {
    try {
        if (await Seller.countDocuments()) return;

        const vendors = Object.keys(companyInfo);
        const promise = vendors.map(async (name) => {
            const vendor = await Vendor.findOne({ name });
            const sellers = companyInfo[name];
            sellers.map((sellerName) => {
                const seller = new Seller({ name: sellerName, vendor });
                seller.save();
            });
        });
        await Promise.all(promise);
    } catch (err) {
        console.log(err);
    }
};

export const initializeProduct = async () => {
    try {
        if (await ProductModel.countDocuments()) return;

        const products = productInfo;
        const promise = products.map(({ name, price }) => {
            const product = new ProductModel({ name, sales_price: price });
            product.save();
        });
        await Promise.all(promise);
    } catch (err) {
        console.log(err);
    }
};
