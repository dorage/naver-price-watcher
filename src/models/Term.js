// 검색어

import mongoose from 'mongoose';

const schema = new mongoose.Schema({
    term: String,
});

const model = mongoose.model('Term', schema);

export default model;
