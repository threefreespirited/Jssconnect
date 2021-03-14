//FOR EXPRESS
const express = require('express');
//FOR ROUTER
const router = express.Router();

//FOR MONGO
const communityUser = require('../models/communityUser');

router.post("/", (req, res) => {
    console.log(req.body.email);
    communityUser.find({ email: req.body.email }, (function (err, data) {
      
      console.log("Userdata ",data);
      
      if (err) console.log(err);
      else {
        if (data == "") {
          const myCommunityUser = new communityUser(req.body);
          myCommunityUser.save();
          res.writeHead(200, { "Content-Type": "text/html" });
          let myResponse = `<img src='http://clipart-library.com/images_k/teamwork-transparent-background/teamwork-transparent-background-15.png' style='margin:60px 42%; width:200px;'><p style='text-align:center;font-size:1.8rem;margin-top:60px;'>Thanks for joining!<br>You can now connect with other JSSATENs on Jssconnect.</p><a href='/community'style='text-align:center;margin-left:42.5%;'><button style='font-size:1.5rem;padding:6px;border-radius:6px;border:2px solid #de4463;background-color:#edc988;cursor:pointer;'>View Community</button></a>`;
          res.write(myResponse);
          res.send();
        }
        else {
          res.send("You are Already a member");
        }
      }
    }))
  
  });


//EXPORT
module.exports = router;