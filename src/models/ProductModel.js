import mongoose from 'mongoose';

// 모델명
// 판매가
const schema = new mongoose.Schema({
    model_name: String,
    sales_price: Number,
});

const model = mongoose.model('ProductModel', schema);

export default model;
