const mongoose = require("mongoose");
//second year Schema

const secondyearSchema = new mongoose.Schema({
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
const secondyearPaperSchema = new mongoose.Schema({
  resname: String,
  year: Number,
  department: String,
  subject: String,
  link: String,
});

// secondYear model

const secondyearBook = mongoose.model("secondyearBook", secondyearSchema);
const secondyearNote = mongoose.model("secondyearNote", secondyearSchema);
const secondyearPapers = mongoose.model(
  "secondyearPapers",
  secondyearPaperSchema
);
// User's secondYear model

const usecondyearBook = mongoose.model("usecondyearBook", secondyearSchema);
const usecondyearNote = mongoose.model("usecondyearNote", secondyearSchema);
const usecondyearPapers = mongoose.model(
  "usecondyearPapers",
  secondyearPaperSchema
);

module.exports = {
  secondyearBook,
  secondyearNote,
  secondyearPapers,
  usecondyearBook,
  usecondyearNote,
  usecondyearPapers,
};
