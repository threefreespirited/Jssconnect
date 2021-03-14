const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = require("../schemas/user");

const User =mongoose.model('user',userSchema);

module.exports = User;