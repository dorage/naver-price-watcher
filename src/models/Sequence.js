// 시점

import mongoose from 'mongoose';

const schema = new mongoose.Schema({
    id: Number,
    created_at: Date,
    processing: Boolean,
});

const model = mongoose.model('Sequence', schema);

export default model;
