// 상품명
// 쇼핑몰 url
// 상품id
// 이미지 url
// 쇼핑몰명
// 메모
// 추적여부

import mongoose, { Mongoose } from 'mongoose';

const schema = new mongoose.Schema({
    task: { type: mongoose.Schema.Types.ObjectId, ref: 'Task' },
    title: String,
    mall_url: String,
    product_id: String,
    img_url: String,
    mall: String,
    memo: String,
    onTracking: Boolean,
});

const model = mongoose.model('Product', schema);

export default model;
