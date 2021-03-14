//FOR EXPRESS
const express = require('express');
const { route } = require('./joincommunity');
//FOR ROUTER
const router = express.Router();
//FOR MODELS
const firstyearBook = require("../models/firstyear/firstyearBook");
const firstyearNote = require("../models/firstyear/firstyearNote");
const firstyearPapers = require("../models/firstyear/firstyearPapers");

router.post("/", async (req, res) => {
    let pageTitle = "FirstYear|Resources";
    let cssName = "css/firstyearresource.css";
    let username = "Guest";
    let picture = "https://cdn2.iconfinder.com/data/icons/ios-7-icons/50/user_male2-512.png";
    let email = "";
    const department = req.body.department;
    const subject = req.body.subject;
    const year = "First Year";
    let books1 = "";
    if (req.isAuthenticated()) {
      username = req.user.name;
      picture = req.user.picture;
      email = req.user.email;
    }
    await firstyearBook.find({ subject: subject }, function (err, foundBooks) {
      if (err) {
        console.log(err);
      } else {
        books1 = foundBooks;
      }
    });
    let notes1 = [];
    await firstyearNote.find({ subject: subject }, function (err, foundNotes) {
      if (err) {
        console.log(err);
      } else {
        notes1 = foundNotes;
      }
    });
    let papers1 = [];
    await firstyearPapers.find({ subject: subject }, function (err, foundPapers) {
      if (err) {
        console.log(err);
      } else {
        papers1 = foundPapers;
      }
    });
    res.render("firstyear", {
      username: username,
      email: email,
      picture: picture,
      year: year,
      Books: books1,
      Notes: notes1,
      Papers: papers1,
      cssName
    });
  });


//EXPORT
module.exports = router;