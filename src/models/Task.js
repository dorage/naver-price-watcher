import mongoose from 'mongoose';

const schema = new mongoose.Schema({
    term: { type: mongoose.Schema.Types.ObjectId, ref: 'Term' },
    progress: String,
    created_at: Date,
});

const model = mongoose.model('Task', schema);

export default model;
