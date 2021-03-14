const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const firstyearSchema = new Schema({
  resname: String,
  authorName: String,
  year: String,
  department: String,
  subject: String,
  link: String,
  yourname: String,
  yourimage: String,
  todaysMonth: String,
});

const ufirstyearBook = mongoose.model('ufirstyearBook',firstyearSchema);

module.exports = ufirstyearBook;