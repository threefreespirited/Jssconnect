const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const feedbackSchema = new Schema({
    name: String,
    email: String,
    review: String,
    overall: Number,
    quality: Number,
    recommend: Number,
    appealing: Number,
});

const feedback = mongoose.model('feedback',feedbackSchema);

module.exports = feedback;