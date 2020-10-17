// 판매처 이름
// 소속

import mongoose from 'mongoose';

const schema = new mongoose.Schema({
    store_name: String,
    vendor: { type: mongoose.Schema.Types.ObjectId, ref: 'Vendor' },
});

const model = mongoose.model('Seller', schema);

export default model;
