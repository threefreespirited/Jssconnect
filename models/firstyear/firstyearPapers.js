const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const firstyearPaperSchema = new Schema({
    resname: String,
    year: Number,
    department: String,
    subject: String,
    link: String,
});

const firstyearPapers = mongoose.model('firstyearPapers',firstyearPaperSchema);

module.exports = firstyearPapers;