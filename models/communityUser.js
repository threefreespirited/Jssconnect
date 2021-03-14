const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const communitySchema = new Schema({
    name:String,
  email:String,
  location:String,
  year:String,
  department:String,
  about:String,
  gHub:String,
  lIn:String,
  picture:String,
  todaysDate:String,
});

const communityUser = mongoose.model('communityUser',communitySchema);

module.exports = communityUser;