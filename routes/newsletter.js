//FOR EXPRESS
const express = require('express');
//FOR ROUTER
const router = express.Router();

//FOR MODELS
const newsletter = require("../models/newsletter");


router.post("/", (req, res) => {

  
    let newsletter_email = new newsletter(req.body);
  
    //Newsletter
    let transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL,
        pass: process.env.PASS,
      },
    });
  
    let mailOptions = {
      from: process.env.EMAIL,
      to: newsletter_email,
      subject: "Sending Email using Node.js",
      text:
        "Thanks for subsciing to Jssconnect. Now you will get regular updates for every event and update.",
    };
  
    transporter.sendMail(mailOptions, function (error, info) {
      if (error) {
        console.log(error);
      } else {
        console.log("Email sent: " + info.response);
      }
    });
  
    res.writeHead(200, { "Content-Type": "text/html" });
    var writeText =
      "<img src='https://cdn.pixabay.com/photo/2016/09/01/08/24/smiley-1635449__340.png' style='margin:60px 42%; width:200px;'><p style='text-align:center;font-size:1.8rem;margin-top:60px;'>Thanks for subscibing!<br>You will now get regular updates from Jssconnect.</p><a href='/'style='text-align:center;margin-left:46%;'><button style='font-size:1.5rem;padding:6px;border-radius:10px;background-color:aliceblue;cursor:pointer;'>Get Back</button></a>";
  
    res.write(writeText);
    res.end();
  });
  

//EXPORT
module.exports = router;