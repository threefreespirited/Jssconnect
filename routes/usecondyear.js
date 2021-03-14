//FOR EXPRESS
const express = require('express');
//FOR ROUTER
const router = express.Router();
//FOR MODELS
const usecondyearBook = require("../models/secondyear/usecondyearBook");
const usecondyearNote = require("../models/secondyear/usecondyearNote");



router.post("/", async (req, res) => {


    const department = req.body.department;
    const subject = req.body.subject;
    const year = "Second Year";
    let books2 = "";
    await usecondyearBook.find(
      { department: department, subject: subject },
      function (err, foundBooks) {
        if (err) {
          console.log(err);
        } else {
          books2 = foundBooks;
        }
      }
    );
    let notes1 = "";
    await usecondyearNote.find({ subject: subject }, function (err, foundNotes) {
      if (err) {
        console.log(err);
      } else {
        notes2 = foundNotes;
      }
  
  
    });
    let papers2 = "";
    res.render("secondyear", { year: year, Books: books2, Notes: notes2, Papers: papers2 });
  });


//EXPORT
module.exports = router;