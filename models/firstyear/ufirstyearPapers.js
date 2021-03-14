const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const firstyearPaperSchema = new Schema({
    resname: String,
    year: Number,
    department: String,
    subject: String,
    link: String,
});

const ufirstyearPapers = mongoose.model('ufirstyearPapers',firstyearPaperSchema);

module.exports = ufirstyearPapers;