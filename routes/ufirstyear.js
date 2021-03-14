//FOR EXPRESS
const express = require('express');
//FOR ROUTER
const router = express.Router();
//FOR MODELS
const ufirstyearBook = require("../models/firstyear/ufirstyearBook");
const ufirstyearNote = require("../models/firstyear/ufirstyearNote");



router.post("/", async (req, res) => {
    const department = req.body.department;
    const subject = req.body.subject;
    let year = "First Year";
    let books1 = "";
    await ufirstyearBook.find({ subject: subject }, function (err, foundBooks) {
      if (err) {
        console.log(err);
      } else {
        books1 = foundBooks;
        console.log(books1);
      }
    });
    let notes1 = "";
    await ufirstyearNote.find({ subject: subject }, function (err, foundNotes) {
      if (err) {
        console.log(err);
      } else {
        notes1 = foundNotes;
        console.log(notes1);
      }
  
    });
    let papers1 = "";
    res.render("firstyear", { year: year, Books: books1, Notes: notes1, Papers: papers1 });
  });


//EXPORT
module.exports = router;