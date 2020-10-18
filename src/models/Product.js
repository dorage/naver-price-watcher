// 이미지 url
// 쇼핑몰 url
// 제목
// 구매건수
// 판매가
// Seller
// ProductModel

import mongoose from 'mongoose';

const schema = new mongoose.Schema({
    product_url: String,
    title: String,
    unit_sales: Number,
    sales_price: Number,
    signed_in: { type: Date, default: Date.now },
    seller: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    product_model: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
});

const model = mongoose.model('Product', schema);

export default model;
