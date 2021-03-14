const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const newsletterSchema = new Schema({
    email: { type: String, required: true },
});

const newsletter = mongoose.model('newsletter',newsletterSchema);

module.exports = newsletter;