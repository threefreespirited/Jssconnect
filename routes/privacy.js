//FOR EXPRESS
const express = require('express');
//FOR ROUTER
const router = express.Router();



router.get("/", (req, res) => {
    let pageTitle = "Privacy";
    let cssName = "css/index.css";
    let username = "Guest";
    let picture = "https://cdn2.iconfinder.com/data/icons/ios-7-icons/50/user_male2-512.png";
    let email = "";
  
    if (req.isAuthenticated()) {
      username = req.user.name;
      picture = req.user.picture;
      email = req.user.email;
    }
    res.render("privacy", { cssName, pageTitle, username, picture, email });
  });


//EXPORT
module.exports = router;