//FOR EXPRESS
const express = require('express');
//FOR ROUTER
const router = express.Router();

//FOR MODELS
const feedback = require("../models/feedback");

router.get("/", (req, res) => {
    let pageTitle = "Feedback";
    let cssName = "css/index.css";
    let username = "Guest";
    let picture = "https://cdn2.iconfinder.com/data/icons/ios-7-icons/50/user_male2-512.png";
    let email = "";
    if (req.isAuthenticated()) {
      username = req.user.name;
      picture = req.user.picture;
      email = req.user.email;
    }
    res.render("feedback", { cssName, pageTitle, username, picture, email });
  });
router.post("/", (req, res) => {
    let myFeedback = new feedback(req.body);
    myFeedback.save();
  
    res.writeHead(200, { "Content-Type": "text/html" });
    let myResponse = `<img src='https://www.clipartkey.com/mpngs/m/14-142559_computer-science-thank-you-for-your-feedback-png.png' style='margin:60px 42%; width:200px;'><p style='text-align:center;font-size:1.8rem;margin-top:20px;'>Thanks for your feedback!<br>This means a lot to us.<br></p><a href='/'style='text-align:center;margin-left:42.5%;'><button style='font-size:1.3rem;padding:9px;border-radius:10px;border:2px solid #30475e;background-color:#d6e0f0;color:#30475e;cursor:pointer;'>Back to Jssconnect</button></a>`;
    res.write(myResponse);
    res.send();
  });

//EXPORT
module.exports = router;