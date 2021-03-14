const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema({
    email: String,
    picture: String,
    name: String,
    googleId: String,
  });


module.exports = userSchema;