//FOR EXPRESS
const express = require('express');
//FOR ROUTER
const router = express.Router();

const contributionRecord = require("../models/contributionRecord");
router.get("/", async (req, res) => {
    let message = "";
    if (req.query.message != "") {
      message = req.query.message;
    }
    let cssName = "css/index.css";
    let contributors = "";
    await contributionRecord.find({}, async (err, data) => {
      if (err) {
        console.log(err);
      }
      else if (data) {
        contributors = await data;
      }
    });
  
    if (req.isAuthenticated()) {
      let username = req.user.name;
      let picture = req.user.picture;
      email = req.user.email;
      console.log(req.user);
      res.render("contribute", { updateMessage: message, cssName, username, picture, email, contributors });
    } else {
      res.redirect("/login");
    }
  });

//EXPORT
module.exports = router;