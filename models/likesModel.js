const mongoose = require("mongoose");

// Like Schema
const likeSchema = new mongoose.Schema({
  uniqueId: String,
  likes: Array,
});
const userLikes = mongoose.model("userLikes", likeSchema);


module.exports = userLikes;