const mongoose = require('mongoose');

const firstyearSchema = new mongoose.Schema({
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
const firstyearPaperSchema = new mongoose.Schema({
  resname: String,
  year: Number,
  department: String,
  subject: String,
  link: String,
});
//firstYear Model
const firstyearBook = mongoose.model("firstyearBook", firstyearSchema);
const firstyearNote = mongoose.model("firstyearNote", firstyearSchema);
const firstyearPapers = mongoose.model("firstyearPapers", firstyearPaperSchema);

// userContributions

//firstYear Model
const ufirstyearBook = mongoose.model("ufirstyearBook", firstyearSchema);
const ufirstyearNote = mongoose.model("ufirstyearNote", firstyearSchema);
const ufirstyearPapers = mongoose.model("ufirstyearPapers", firstyearPaperSchema);

module.exports = {
  firstyearBook,
  firstyearNote,
  firstyearPapers,
  ufirstyearBook,
  ufirstyearNote,
  ufirstyearPapers,
};