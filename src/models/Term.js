// 검색어

import mongoose from 'mongoose';

const schema = new mongoose.Schema({
    term: String,
});

const model = mongoose.model('Vendor', schema);

export default model;
