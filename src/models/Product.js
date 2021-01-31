// 이미지 url
// 쇼핑몰 url
// 제목
// 구매건수
// 판매가
// Seller
// ProductModel

import mongoose from 'mongoose';

const schema = new mongoose.Schema({
    mallName: String,
    name: String,
    inner_id: String,
    regular_price: Number,
    outer_price: Number,
    inner_price: Number,
    thumbnail: String,
    url: String,
    info: String, // 개인에 따라 할 수 있으니 유저정보에 들어가야할 것 같다.
});

const model = mongoose.model('Product', schema);

export default model;
