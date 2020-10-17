// 회사명

import mongoose from 'mongoose';

const schema = new mongoose.Schema({
    name: String,
});

const model = mongoose.model('Vendor', schema);

export default model;
