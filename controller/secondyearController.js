const {
  secondyearBook,
  secondyearNote,
  secondyearPapers,
  usecondyearBook,
  usecondyearNote,
  usecondyearPapers,
} = require("../models/secondyearModel");

// SecondYear Resources

// finds from all second year resources
const findSecondYear = async (req, res) => {
  let pageTitle = "SecondYear|Resources";
  let cssName = "css/firstyearresource.css";
  let username = "Guest";
  let picture =
    "https://cdn2.iconfinder.com/data/icons/ios-7-icons/50/user_male2-512.png";
  let email = "";
  const department = req.body.department;
  const subject = req.body.subject;
  const year = "Second Year";
  let books2 = "";
  if (req.isAuthenticated()) {
    username = req.user.name;
    picture = req.user.picture;
    email = req.user.email;
  }
  await secondyearBook.find(
    {
      department: department,
      subject: subject,
    },
    function (err, foundBooks) {
      if (err) {
        console.log(err);
      } else {
        books2 = foundBooks;
      }
    }
  );
  let notes2 = "";
  await secondyearNote.find(
    {
      subject: subject,
    },
    function (err, foundNotes) {
      if (err) {
        console.log(err);
      } else {
        notes2 = foundNotes;
      }
    }
  );
  let papers2 = "";
  await secondyearPapers.find(
    {
      subject: subject,
    },
    function (err, foundPapers) {
      if (err) {
        console.log(err);
      } else {
        papers2 = foundPapers;
      }
    }
  );
  res.render("secondyear", {
    username: username,
    email: email,
    picture: picture,
    year: year,
    Books: books2,
    Notes: notes2,
    Papers: papers2,
    cssName,
    pageTitle,
  });
};

// User's SecondYear Resources

// finds user's secondyear resources
const findUserSecondYear = async (req, res) => {
  const department = req.body.department;
  const subject = req.body.subject;
  const year = "Second Year";
  let books2 = "";
  await usecondyearBook.find(
    {
      department: department,
      subject: subject,
    },
    function (err, foundBooks) {
      if (err) {
        console.log(err);
      } else {
        books2 = foundBooks;
      }
    }
  );
  let notes1 = "";
  await usecondyearNote.find(
    {
      subject: subject,
    },
    function (err, foundNotes) {
      if (err) {
        console.log(err);
      } else {
        notes2 = foundNotes;
      }
    }
  );
  let papers2 = "";
  res.render("secondyear", {
    year: year,
    Books: books2,
    Notes: notes2,
    Papers: papers2,
  });
};

module.exports = { findSecondYear, findUserSecondYear };
