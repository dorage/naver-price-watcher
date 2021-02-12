// 이미지 url
// 쇼핑몰 url
// 제목
// 구매건수
// 판매가
// Seller
// ProductModel

import mongoose, { Mongoose } from 'mongoose';

const schema = new mongoose.Schema({
    title: String,
    price: Number,
    mall_url: String,
    img_url: String,
    mall: String,
    task: { type: mongoose.Schema.Types.ObjectId, ref: 'Task' },
});

const model = mongoose.model('Product', schema);

export default model;
