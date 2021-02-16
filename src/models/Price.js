// Task
// Product
// 외부가격

import mongoose, { Mongoose } from 'mongoose';

const schema = new mongoose.Schema({
    task: { type: mongoose.Schema.Types.ObjectId, ref: 'Task' },
    product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
    price: Number,
});

const model = mongoose.model('Price', schema);

export default model;
