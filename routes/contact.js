//FOR EXPRESS
const express = require('express');
//FOR ROUTER
const router = express.Router();

//FOR MONGO
const contact = require('../models/contact');

router.get("/", (req, res) => {
  let pageTitle = "Contact";
  let cssName = "css/team.css";
  let username = "Guest";
  let picture = "https://cdn2.iconfinder.com/data/icons/ios-7-icons/50/user_male2-512.png";
  let email = "";
  if (req.isAuthenticated()) {
    username = req.user.name;
    picture = req.user.picture;
    email = req.user.email;
  }

  res.render("contact", { username, picture, email, pageTitle, cssName });
});
router.post("/", (req, res) => {
    let myContact = new contact(req.body);
    myContact.save();
  
    res.writeHead(200, { "Content-Type": "text/html" });
    let myResponse = `<img src='https://www.kindpng.com/picc/b/357/3576404.png' style='margin:60px 42%; width:200px;'><p style='text-align:center;font-size:1.8rem;margin-top:20px;'>We will get back to you as soon as possible!<br>We are glad to hear from you.<br></p><a href='/'style='text-align:center;margin-left:42.5%;'><button style='font-size:1.3rem;padding:9px;border-radius:10px;border:2px solid #30475e;background-color:#d6e0f0;color:#30475e;cursor:pointer;'>Back to Jssconnect</button></a>`;
    res.write(myResponse);
    res.send();
  });


//EXPORT
module.exports = router;