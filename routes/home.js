
//FOR EXPRESS
const express = require('express');
//FOR ROUTER
const router = express.Router();

//FOR MONGO
const communityUser = require('../models/communityUser');


router.get("/", (req, res) => {
    let pageTitle = "JSS Connect";
    let cssName = "css/index.css";
    let username = "Guest";
    let email = "";
    let picture = "https://cdn2.iconfinder.com/data/icons/ios-7-icons/50/user_male2-512.png";
    let member = "";
    if (req.isAuthenticated()) {
      username = req.user.name;
      picture = req.user.picture;
      email = req.user.email;
      communityUser.find({ email: email }, (err, data) => {
        if (err) {
          console.log(err);
        }
        else {
          console.log(data);
          if (data != "")
            member = true;
          else
            member = false;
        }
      });
    }
    let community = "";
    communityUser.find({}, (err, data) => {
      if (err) {
        console.log(err);
      }
      else {
        community = data;
        
        res.render("index", { pageTitle: pageTitle, cssName: cssName, username, picture, email, community, member });
      }
    });
  });

  //EXPORT
module.exports = router;