const {
  firstyearBook,
  firstyearNote,
  firstyearPapers,
  ufirstyearBook,
  ufirstyearNote,
  ufirstyearPapers,
} = require("../models/firstyearModel");

// FirstYear Resources

// finds first year resources according to filter
const findFirstYear  =  async (req, res) => {
  let pageTitle = "FirstYear|Resources";
  let cssName = "css/firstyearresource.css";
  let username = "Guest";
  let picture =
    "https://cdn2.iconfinder.com/data/icons/ios-7-icons/50/user_male2-512.png";
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
  await firstyearBook.find(
    {
      subject: subject,
    },
    function (err, foundBooks) {
      if (err) {
        console.log(err);
      } else {
        books1 = foundBooks;
      }
    }
  );
  let notes1 = [];
  await firstyearNote.find(
    {
      subject: subject,
    },
    function (err, foundNotes) {
      if (err) {
        console.log(err);
      } else {
        notes1 = foundNotes;
      }
    }
  );
  let papers1 = [];
  await firstyearPapers.find(
    {
      subject: subject,
    },
    function (err, foundPapers) {
      if (err) {
        console.log(err);
      } else {
        papers1 = foundPapers;
      }
    }
  );
  res.render("firstyear", {
    username: username,
    email: email,
    picture: picture,
    year: year,
    Books: books1,
    Notes: notes1,
    Papers: papers1,
    cssName,
    pageTitle,
  });
}



// finds first year resources of the user

const findUserFirstYear =  async (req, res) => {
  const department = req.body.department;
  const subject = req.body.subject;
  let pageTitle = "FirstYear|Resources";
  let year = "First Year";
  let books1 = "";
  await ufirstyearBook.find(
    {
      subject: subject,
    },
    function (err, foundBooks) {
      if (err) {
        console.log(err);
      } else {
        books1 = foundBooks;
        console.log(books1);
      }
    }
  );
  let notes1 = "";
  await ufirstyearNote.find(
    {
      subject: subject,
    },
    function (err, foundNotes) {
      if (err) {
        console.log(err);
      } else {
        notes1 = foundNotes;
        console.log(notes1);
      }
    }
  );
  let papers1 = "";
  res.render("firstyear", {
    year: year,
    Books: books1,
    Notes: notes1,
    Papers: papers1,
    pageTitle,
  });
}


module.exports = { findFirstYear, findUserFirstYear };