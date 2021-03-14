//FOR EXPRESS
const express = require('express');
//FOR ROUTER
const router = express.Router();

//FOR MONGO
const userBlog = require('../models/userBlog');


router.get("/", function (req, res) {
  let pageTitle = "Your Blog";
  let cssName = "css/blogs.css";

  if (req.isAuthenticated()) {
    let username = req.user.name;
    let picture = req.user.picture;
     email = req.user.email;
    res.render("userblog", {pageTitle, cssName, username, picture, email });
  } else {
    res.redirect("/login");
  }
});
router.post("/", (req, res) => {
    let myuserBlog = new userBlog(req.body);
    myuserBlog.save();
  
    res.writeHead(200, { "Content-Type": "text/html" });
    let myResponse = `<img src='https://img2.pngio.com/writing-services-png-picture-889262-writing-services-png-web-content-png-650_519.png' style='margin:60px 42%; width:200px;'><p style='text-align:center;font-size:1.8rem;margin-top:20px;'>Thanks for adding one!<br>We hope your blog is worthy enough to be displayed on our dashboard.<br><br>Our team will look onto it as soon as possible..</p><a href='/'style='text-align:center;margin-left:42.5%;'><button style='font-size:1.3rem;padding:9px;border-radius:10px;border:2px solid #30475e;background-color:#d6e0f0;color:#30475e;cursor:pointer;'>Back to Jssconnect</button></a>`;
    res.write(myResponse);
    res.send();
  });


//EXPORT
module.exports = router;