const mongoose = require('mongoose');


// Comment Schema
const commentSchema = new mongoose.Schema({
  authorName: String,
  date: String,
  commentInput: String,
  uniqueId: String,
  email: String,
  picture: String,
});
const userComment = mongoose.model("userComment", commentSchema);
module.exports = userComment
    ;