const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const contributionRecordSchema = new Schema({
    type: String,
    yourname: String,
    yourimage: String,
    todaysMonth: String,
});

const contributionRecord = mongoose.model('contributionRecord',contributionRecordSchema);

module.exports = contributionRecord;