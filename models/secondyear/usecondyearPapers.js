const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const secondyearPaperSchema = new Schema({
    resname: String,
    year: Number,
    department: String,
    subject: String,
    link: String,
});

const usecondyearPapers = mongoose.model('usecondyearPapers',secondyearPaperSchema);

module.exports = usecondyearPapers;