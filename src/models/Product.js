// 이미지 url
// 쇼핑몰 url
// 제목
// 구매건수
// 판매가
// Seller
// ProductModel

import mongoose from 'mongoose';

const schema = new mongoose.Schema({
    url: String,
    title: String,
    unit_sales: Number,
    sales_price: Number,
    sequence: { type: mongoose.Schema.Types.ObjectId, ref: 'Sequence' },
    seller: { type: mongoose.Schema.Types.ObjectId, ref: 'Seller' },
    product_model: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'ProductModel',
    },
});

const model = mongoose.model('Product', schema);

export default model;
