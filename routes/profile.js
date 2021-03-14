//FOR EXPRESS
const express = require('express');
//FOR ROUTER
const router = express.Router();
//FOR MODELS
const User = require("../models/user");

router.get(`/:token`, (req, res) => {
    const token1 = req.params.token;
    console.log("token1");
    console.log(token1);
    passport.authenticate("google", { failureRedirect: "/login" });
    if (req.isAuthenticated()) {
      User.find({ email: token1 }, (err, user) => {
        if (err) {
          console.log(err);
        } else {
          res.send(user);
        }
      });
    }
  });

//EXPORT
module.exports = router;