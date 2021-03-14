const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userBlogSchema = new Schema({
  title: String,
  imageurl: String,
  socialurl: String,
  permission: String,
  date: String,
  shortDescription: String,
  blogcontent: String,
  authorName: String,
  authorImg: String,
});

const userBlog = mongoose.model('userBlog',userBlogSchema);

module.exports = userBlog;