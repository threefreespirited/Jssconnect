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

const firstyearBook = mongoose.model('firstyearBook',firstyearSchema);

module.exports = firstyearBook;