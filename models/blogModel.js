const mongoose = require("mongoose");

// Blog Schema for General Data

const userBlogSchema = new mongoose.Schema({
  title: {
    type: String,
  },
  imageurl: { type: String },
  socialurl: { type: String },
  permission: { type: String },
  date: { type: String },
  shortDescription: { type: String },
  blogcontent: { type: String },
  authorName: { type: String },
  authorImg: { type: String },
});

// Model for userBlog Schema

const userBlog = mongoose.model("userBlog", userBlogSchema);

module.exports = userBlog;
