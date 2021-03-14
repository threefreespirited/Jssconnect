//FOR EXPRESS
const express = require('express');
//FOR ROUTER
const router = express.Router();
//FOR MODLES
const contributionRecord = require("../models/contributionRecord");
const ufirstyearBook = require("../models/firstyear/ufirstyearBook");
const ufirstyearNote = require("../models/firstyear/ufirstyearNote");
const usecondyearBook = require("../models/secondyear/usecondyearBook");
const usecondyearNote = require("../models/secondyear/usecondyearNote");

router.post("/", (req, res) => {
    const year = req.body.year;
    const type = req.body.type;
  
    console.log(type);
    // saving record
    const contributionrecord = new contributionRecord(req.body);
    contributionrecord.save();
  
    if (year == "1") {
      switch (type) {
        case "book": {
          const ufirstyearBook1 = new ufirstyearBook(req.body);
          ufirstyearBook1.save(req.body);
          break;
        }
        case "note": {
          const ufirstyearNote1 = new ufirstyearNote(req.body);
          ufirstyearNote1.save(req.body);
          break;
        }
      }
    } else if (year == "2") {
      switch (type) {
        case "book": {
          const usecondyearBook1 = new usecondyearBook(req.body);
          usecondyearBook1.save(req.body);
          break;
        }
        case "note": {
          const usecondyearNote1 = new usecondyearNote(req.body);
          usecondyearNote1.save(req.body);
          break;
        }
      }
    }
  
    res.redirect(url.format({
      pathname: `/contribute`,
      query: {
        message: "Your data has been saved to database. Thanks for contributing."
      }
    }));
  
    // usecondyearBook1.save();
    // usecondyearNote1.save();
  });

//EXPORT
module.exports = router;