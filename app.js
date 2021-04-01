//Module Dependences

const express = require("express");
const nodemailer = require("nodemailer");
require("dotenv").config();
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const session = require("express-session");
const passport = require("passport");
const passportLocalMongoose = require("passport-local-mongoose");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const findOrCreate = require("mongoose-findorcreate");
const ejs = require("ejs");
var url = require('url');
const hostname = "127.0.0.1";
const port = process.env.PORT || "3000";

//List of letiables

const app = express();
app.use(
  session({
    secret: process.env.SECRET,
    resave: false,
    saveUninitialized: false,
  })
);
app.use(passport.initialize());
app.use(passport.session());

const MONGODB_URI = process.env.MONGODB_URI;
mongoose.connect(MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
mongoose.set("useCreateIndex", true);
const db = mongoose.connection;

db.on("connected", () => {
  console.log("Mongoose is connected!");
});

mongoose.set("useCreateIndex", true);
app.use(express.static("public"));
// app.use("/views", express.static(__dirname + "/views"));
app.set("view engine", "ejs");

app.use(bodyParser.urlencoded({ extended: true }));

//body-parser
app.use(bodyParser.json());
const userSchema = new mongoose.Schema({
  email: String,
  picture: String,
  name: String,
  googleId: String,
});

userSchema.plugin(passportLocalMongoose);
userSchema.plugin(findOrCreate);

const User = mongoose.model("User", userSchema);
passport.use(User.createStrategy());

passport.serializeUser(function (user, done) {
  done(null, user.id);
});

passport.deserializeUser(function (id, done) {
  User.findById(id, function (err, user) {
    done(err, user);
  });
});
let myEmail = "";

// Userblogs Strategy
passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.CLIENT_ID,
      clientSecret: process.env.CLIENT_SECRET,
      callbackURL: "/auth/google/home",
      userProfileURL: "https://www.googleapis.com/oauth2/v3/userinfo",
    },
    function (accessToken, refreshToken, profile, cb) {
      console.log(profile);
      User.findOrCreate(
        {
          googleId: profile.id,
          name: profile.displayName,
          picture: profile.photos[0].value,
          email: profile.emails[0].value,
        },
        function (err, user) {
          console.log(user);
          myEmail = user.email;
          return cb(err, user);
        }
      );
    }
  )
);

//Now the profile will be updated only when the user is authenticated

app.get(`/profile/:token`, (req, res) => {
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

app.get('/auth/google',
  passport.authenticate('google', { scope: ['profile', "email"] })
);

app.get(
  "/auth/google/home",
  passport.authenticate("google", { failureRedirect: "/login" }),
  function (req, res) {
    // Successful authentication, redirect home.
    res.redirect(`/`);
  }
);



// app.get("/contribute", function (req, res) {
// if (req.isAuthenticated()) {
//   res.render("contribute");
// } else {
//   res.redirect("/login");
// }
// });

app.get("/logout", function (req, res) {
  req.logOut();
  res.redirect("/");
});

// Community

const communitySchema = new mongoose.Schema({
  name: String,
  email: String,
  location: String,
  year: String,
  department: String,
  about: String,
  gHub: String,
  lIn: String,
  picture: String,
  todaysDate: String,
});

const communityUser = mongoose.model("communityUser", communitySchema);

app.post("/joincommunity", (req, res) => {
  console.log(req.body.email);
  communityUser.find({ email: req.body.email }, (function (err, data) {
    if (err) console.log(err);
    else {
      if (data == "") {
        const myCommunityUser = new communityUser(req.body);
        myCommunityUser.save();
        //Schema
        const Schema = mongoose.Schema;
        const newsletterSchema = new Schema({
          email: { type: String, required: true },
        });

        //Model
        const newsletter = mongoose.model("newsletter", newsletterSchema);
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
          subject: "Welcome to JSSConnect Community",
          text:
            "Thanks for joining Jssconnect. Now you will get regular emails for every event and update.",
        };

        transporter.sendMail(mailOptions, function (error, info) {
          if (error) {
            console.log(error);
          } else {
            console.log("Email sent: " + info.response);
          }
        });
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

// Userblogs

const userBlogSchema = new mongoose.Schema({
  title: String,
  imageurl: String,
  socialurl: String,
  permission: String,
  date: String,
  shortDescription: String,
  blogcontent: String,
  authorName: String,
  authorImg: String,
});

const userBlog = mongoose.model("userBlog", userBlogSchema);

app.post("/userblog", (req, res) => {
  let myuserBlog = new userBlog(req.body);
  myuserBlog.save();

  res.writeHead(200, { "Content-Type": "text/html" });
  let myResponse = `<img src='https://img2.pngio.com/writing-services-png-picture-889262-writing-services-png-web-content-png-650_519.png' style='margin:60px 42%; width:200px;'><p style='text-align:center;font-size:1.8rem;margin-top:20px;'>Thanks for adding one!<br>We hope your blog is worthy enough to be displayed on our dashboard.<br><br>Our team will look onto it as soon as possible..</p><a href='/'style='text-align:center;margin-left:42.5%;'><button style='font-size:1.3rem;padding:9px;border-radius:10px;border:2px solid #30475e;background-color:#d6e0f0;color:#30475e;cursor:pointer;'>Back to Jssconnect</button></a>`;
  res.write(myResponse);
  res.send();
});

// Comment Schema 
const commentSchema = new mongoose.Schema({
  authorName: String,
  date: String,
  commentInput: String,
})
const userComment = mongoose.model("userComment", commentSchema);
app.post("/savecomment", (req, res) => {
  console.log("post happend");
  console.log(req.body);

  if (req.isAuthenticated()) {
    console.log("U'r Signed Succesffully");
    console.log(req.user);
    let myuserComment = new userComment(req.body);
    myuserComment.save();
    res.send("Your Comment Save");
  }
  else {
    console.log("Not Signed In");
    res.send("Please Sign In First");
  }

})
// Contact
const contactSchema = new mongoose.Schema({
  name: String,
  email: String,
  number: String,
  message: String,
});

const contact = mongoose.model("contact", contactSchema);

app.post("/contact", (req, res) => {
  let myContact = new contact(req.body);
  myContact.save();

  res.writeHead(200, { "Content-Type": "text/html" });
  let myResponse = `<img src='https://www.kindpng.com/picc/b/357/3576404.png' style='margin:60px 42%; width:200px;'><p style='text-align:center;font-size:1.8rem;margin-top:20px;'>We will get back to you as soon as possible!<br>We are glad to hear from you.<br></p><a href='/'style='text-align:center;margin-left:42.5%;'><button style='font-size:1.3rem;padding:9px;border-radius:10px;border:2px solid #30475e;background-color:#d6e0f0;color:#30475e;cursor:pointer;'>Back to Jssconnect</button></a>`;
  res.write(myResponse);
  res.send();
});

// Feedback

const feedbackSchema = new mongoose.Schema({
  name: String,
  email: String,
  review: String,
  overall: Number,
  quality: Number,
  recommend: Number,
  appealing: Number,
});

const feedback = mongoose.model("feedback", feedbackSchema);

app.post("/feedback", (req, res) => {
  let myFeedback = new feedback(req.body);
  myFeedback.save();

  res.writeHead(200, { "Content-Type": "text/html" });
  let myResponse = `<img src='https://www.clipartkey.com/mpngs/m/14-142559_computer-science-thank-you-for-your-feedback-png.png' style='margin:60px 42%; width:200px;'><p style='text-align:center;font-size:1.8rem;margin-top:20px;'>Thanks for your feedback!<br>This means a lot to us.<br></p><a href='/'style='text-align:center;margin-left:42.5%;'><button style='font-size:1.3rem;padding:9px;border-radius:10px;border:2px solid #30475e;background-color:#d6e0f0;color:#30475e;cursor:pointer;'>Back to Jssconnect</button></a>`;
  res.write(myResponse);
  res.send();
});

// Newsletter

app.post("/newsletter", (req, res) => {
  //Schema
  const Schema = mongoose.Schema;
  const newsletterSchema = new Schema({
    email: { type: String, required: true },
  });

  //Model
  const newsletter = mongoose.model("newsletter", newsletterSchema);
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

//first year Schema
const firstyearSchema = new mongoose.Schema({
  resname: String,
  authorName: String,
  year: String,
  department: String,
  subject: String,
  link: String,
  yourname: String,
  yourimage: String,
  todaysMonth: String,
});
const firstyearPaperSchema = new mongoose.Schema({
  resname: String,
  year: Number,
  department: String,
  subject: String,
  link: String,
});
//second year Schema
const secondyearSchema = new mongoose.Schema({
  resname: String,
  authorName: String,
  year: String,
  department: String,
  subject: String,
  link: String,
  yourname: String,
  yourimage: String,
  todaysMonth: String,
});
const secondyearPaperSchema = new mongoose.Schema({
  resname: String,
  year: Number,
  department: String,
  subject: String,
  link: String,
});

// contribution record Schema
const contributionRecordSchema = new mongoose.Schema({
  type: String,
  yourname: String,
  yourimage: String,
  todaysMonth: String,
});
const contributionRecord = mongoose.model("contributionRecord", contributionRecordSchema);

//firstYear Model
const firstyearBook = mongoose.model("firstyearBook", firstyearSchema);
const firstyearNote = mongoose.model("firstyearNote", firstyearSchema);
const firstyearPapers = mongoose.model("firstyearPapers", firstyearPaperSchema);
// const firstyearVideos = mongoose.model("firstyearVideos", firstyearSchema)

// app.post("/contribute", (req, res) => {
//   // const firstyearBook1 = new firstyearBook(req.body);
//   // const firstyearNote1 = new firstyearNote(req.body);
//   const firstyearPapers1 = new firstyearPapers(req.body);
//   // const firstyearVideos1 = new firstyearVideos(req.body);

//   // firstyearBook1.save();
//   // firstyearNote1.save();
//   firstyearPapers1.save();
//   // firstyearVideos1.save();

// })

// secondYear model

const secondyearBook = mongoose.model("secondyearBook", secondyearSchema);
const secondyearNote = mongoose.model("secondyearNote", secondyearSchema);
const secondyearPapers = mongoose.model(
  "secondyearPapers",
  secondyearPaperSchema
);
// const secondyearVideos = mongoose.model("secondyearVideos", secondyearSchema)

// app.post("/contribute", (req, res) => {
// // const secondyearBook1 = new secondyearBook(req.body);
//   // const secondyearNote1 = new secondyearNote(req.body);
//   // const secondyearPapers1 = new secondyearPapers(req.body);
//   // const secondyearVideos1 = new secondyearVideos(req.body);

//   // secondyearBook1.save();
//   // secondyearNote1.save();
//   // secondyearPapers1.save();
//   // secondyearVideos1.save();
// })

// HOME PAGE 
app.get("/", (req, res) => {
  let pageTitle = "JSS Connect";
  let cssName = "css/index.css";
  let username = "Guest";
  let email = "";
  let picture = "https://cdn2.iconfinder.com/data/icons/ios-7-icons/50/user_male2-512.png";
  let member = "";
  if (req.isAuthenticated()) {
    username = req.user.name;
    picture = req.user.picture;
    email = req.user.email;
    communityUser.find({ email: email }, (err, data) => {
      if (err) {
        console.log(err);
      }
      else {
        console.log(data);
        if (data != "")
          member = true;
        else
          member = false;
      }
    });
  }
  let community = "";
  communityUser.find({}, (err, data) => {
    if (err) {
      console.log(err);
    }
    else {
      community = data;
      res.render("index", { pageTitle: pageTitle, cssName: cssName, username, picture, email, community, member });
    }
  });
});
//////////////////////////////////////////////////////////////////////////////////////////////////////////
/* Contact Page */
app.get("/contact", (req, res) => {
  let pageTitle = "Contact";
  let cssName = "css/team.css";
  let username = "Guest";
  let picture = "https://cdn2.iconfinder.com/data/icons/ios-7-icons/50/user_male2-512.png";
  let email = "";
  if (req.isAuthenticated()) {
    username = req.user.name;
    picture = req.user.picture;
    email = req.user.email;
  }

  res.render("contact", { username, picture, email, pageTitle, cssName });
});

// LOGIN PAGE
app.get("/login", (req, res) => {
  let pageTitle = "JSS Connect";
  let cssName = "css/login.css";
  let username = "Guest";
  let picture = "https://cdn2.iconfinder.com/data/icons/ios-7-icons/50/user_male2-512.png"; let email = "";
  if (req.isAuthenticated()) {
    username = req.user.name;
    picture = req.user.picture;
    email = req.user.email;
  }
  res.render("login", { pageTitle: pageTitle, cssName: cssName, username, picture, email });
});
// REGISTER PAGE
app.get("/register", (req, res) => {
  let username = "Guest";
  let picture = "https://cdn2.iconfinder.com/data/icons/ios-7-icons/50/user_male2-512.png"; let email = "";
  if (req.isAuthenticated()) {
    username = req.user.name;
    picture = req.user.picture;
    email = req.user.email;
  }
  res.render("register", { username, picture, email });
});
// RESOURCE PAGE
app.get("/resources", (req, res) => {
  let username = "Guest";
  let cssName = "css/resource.css";
  let pageTitle = "JSS Connect|Resources";
  let picture = "https://cdn2.iconfinder.com/data/icons/ios-7-icons/50/user_male2-512.png"; let email = "";
  if (req.isAuthenticated()) {
    username = req.user.name;
    picture = req.user.picture;
    email = req.user.email;
  }
  res.render("resources", { username, picture, email, pageTitle: pageTitle, cssName: cssName });

});
app.get("/about", (req, res) => {
  let username = "Guest";
  let picture = "https://cdn2.iconfinder.com/data/icons/ios-7-icons/50/user_male2-512.png"; let email = "";
  if (req.isAuthenticated()) {
    username = req.user.name;
    picture = req.user.picture;
    email = req.user.email;
  }
  res.render("about", { username, picture, email });
});
app.get("/privacy", (req, res) => {
  let pageTitle = "Privacy";
  let cssName = "css/index.css";
  let username = "Guest";
  let picture = "https://cdn2.iconfinder.com/data/icons/ios-7-icons/50/user_male2-512.png";
  let email = "";

  if (req.isAuthenticated()) {
    username = req.user.name;
    picture = req.user.picture;
    email = req.user.email;
  }
  res.render("privacy", { cssName, pageTitle, username, picture, email });
});
// CONTRIBUTE RESOURCES PAGE
app.get("/contribute", async (req, res) => {
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

// USER CONTRIBUTION SECTION
app.get("/usercontributions", (req, res) => {
  let username = "Guest";
  let picture = "https://cdn2.iconfinder.com/data/icons/ios-7-icons/50/user_male2-512.png"; let email = "";
  if (req.isAuthenticated()) {
    username = req.user.name;
    picture = req.user.picture;
    email = req.user.email;
  }
  res.render("usercontributions", { username, picture, email });
});

// FEEDBACK
app.get("/feedback", (req, res) => {
  let pageTitle = "Feedback";
  let cssName = "css/index.css";
  let username = "Guest";
  let picture = "https://cdn2.iconfinder.com/data/icons/ios-7-icons/50/user_male2-512.png";
  let email = "";
  if (req.isAuthenticated()) {
    username = req.user.name;
    picture = req.user.picture;
    email = req.user.email;
  }
  res.render("feedback", { cssName, pageTitle, username, picture, email });
});

app.get("/dataupload", (req, res) => {
  let username = "Guest";
  let picture = "https://cdn2.iconfinder.com/data/icons/ios-7-icons/50/user_male2-512.png"; let email = "";
  if (req.isAuthenticated()) {
    username = req.user.name;
    picture = req.user.picture;
    email = req.user.email;
  }
  res.render("dataupload", { username, picture, email });
});

app.post("/myblog", (req, res) => {
  console.log(req.body.uniqueId);
  let uniId = req.body.uniqueId;
  let pageTitle = "Blogs";
  let cssName = "css/blogs.css";
  let username = "Guest";
  let like = 0;
  let uniqueId = uniId;
  let picture = "https://cdn2.iconfinder.com/data/icons/ios-7-icons/50/user_male2-512.png"; let email = "";
  if (req.isAuthenticated()) {
    username = req.user.name;
    picture = req.user.picture;
    email = req.user.email;
  }
  userBlog.find({}, (err, data) => {
    if (err) console.log(err);
    else {
      console.log(data[uniId]);
      console.log("hi am");
      if (data.link == undefined) {
        console.log("no record");
      }
      res.render("blog", { blogData: data[uniId], username, picture, email, title: pageTitle, cssName: cssName, uniqueId: uniqueId });
    }
  });
});

app.get("/blogs", (req, res) => {
  let pageTitle = "Blogs";
  let cssName = "css/blogs.css";
  let username = "Guest";
  let picture = "https://cdn2.iconfinder.com/data/icons/ios-7-icons/50/user_male2-512.png"; let email = "";
  if (req.isAuthenticated()) {
    username = req.user.name;
    picture = req.user.picture;
    email = req.user.email;
  }

  userBlog.find({}, (err, data) => {
    if (err) console.log(err);
    else {
      console.log(data[2].imageurl);
      res.render("blogs", { data: data, title: pageTitle, cssName: cssName, username, picture, email });
    }
  });
});

app.get("/userblog", function (req, res) {
  let pageTitle = "Your Blog";
  let cssName = "css/blogs.css";

  if (req.isAuthenticated()) {
    let username = req.user.name;
    let picture = req.user.picture;
    email = req.user.email;
    res.render("userblog", { pageTitle, cssName, username, picture, email });
  } else {
    res.redirect("/login");
  }
});



// Community

app.get("/community", async (req, res) => {
  let commData = [];
  let cssName = "css/index.css";

  await User.find({}, async (error, found) => {
    if (error) {
      console.log(error);
      console.log("myImg");
    } else {
      // console.log(found[0].picture);
      for (var j = 0; j < found.length; j++) {
        var dataToPush = { picture: found[j].picture, email: found[j].email };
        await commData.push(dataToPush);
      }
    }
  });

  await communityUser.find({}, (err, data) => {
    if (err) {
      console.log(err);
      res.writeHead(404, { "Content-Type": "text/html" });
      res.write(
        '<img src="https://cdn.dribbble.com/users/1963449/screenshots/5915645/404_not_found.png" alt="not found">'
      );
      res.send();
    } else {
      console.log(data);
      console.log(commData);

      let username = "Guest";
      let picture = "https://cdn2.iconfinder.com/data/icons/ios-7-icons/50/user_male2-512.png"; let email = "";
      if (req.isAuthenticated()) {
        username = req.user.name;
        picture = req.user.picture;
        email = req.user.email;
      }

      res.render("community", {
        data: data,
        commData: commData,
        cssName,
        username, picture, email
      });
    }
  });
});

// Community Filter

app.post("/CommunityFilter", (req, res) => {
  let myYear = req.body.year;
  let myDepartment = req.body.department;
  var myCommunity = "";
  let commData = [];

  User.find({}, (error, found) => {
    if (error) {
      console.log(error);
      console.log("myImg");
    } else {
      // console.log(found[0].picture);
      for (var j = 0; j < found.length; j++) {
        var dataToPush = { picture: found[j].picture, email: found[j].email };
        commData.push(dataToPush);
      }
    }
  });

  communityUser.find(
    { year: myYear, department: myDepartment },
    (err, data) => {
      if (err) {
        console.log(err);
        res.writeHead(404, { "Content-Type": "text/html" });
        res.write(
          '<img src="https://cdn.dribbble.com/users/1963449/screenshots/5915645/404_not_found.png" alt="not found">'
        );
        res.send();
      } else {
        let username = "Guest";
        let picture = "https://cdn2.iconfinder.com/data/icons/ios-7-icons/50/user_male2-512.png"; let email = "";
        if (req.isAuthenticated()) {
          let username = req.user.name;
          let picture = req.user.picture;
          email = req.user.email;
        }

        console.log(data);
        console.log(commData);
        res.render("community", {
          data: data,
          commData: commData,
          username, picture, email
        });
      }
    }
  );
});

// userContributions

//firstYear Model
const ufirstyearBook = mongoose.model("ufirstyearBook", firstyearSchema);
const ufirstyearNote = mongoose.model("ufirstyearNote", firstyearSchema);
const ufirstyearPapers = mongoose.model("ufirstyearPapers", firstyearPaperSchema);

// secondYear model

const usecondyearBook = mongoose.model("usecondyearBook", secondyearSchema);
const usecondyearNote = mongoose.model("usecondyearNote", secondyearSchema);
const usecondyearPapers = mongoose.model(
  "usecondyearPapers",
  secondyearPaperSchema
);
// const secondyearVideos = mongoose.model("secondyearVideos", secondyearSchema)

app.post("/ucontribute", (req, res) => {
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


// FirstYear Resources
app.post("/firstyear", async (req, res) => {
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

// SecondYear Resources
app.post("/secondyear", async (req, res) => {
  let pageTitle = "SecondYear|Resources";
  let cssName = "css/firstyearresource.css";
  let username = "Guest";
  let picture = "https://cdn2.iconfinder.com/data/icons/ios-7-icons/50/user_male2-512.png";
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
    { department: department, subject: subject },
    function (err, foundBooks) {
      if (err) {
        console.log(err);
      } else {
        books2 = foundBooks;
      }
    }
  );
  let notes2 = "";
  await secondyearNote.find({ subject: subject }, function (err, foundNotes) {
    if (err) {
      console.log(err);
    } else {
      notes2 = foundNotes;
    }
  });
  let papers2 = "";
  await secondyearPapers.find(
    { subject: subject },
    function (err, foundPapers) {
      if (err) {
        console.log(err);
      } else {
        papers2 = foundPapers;
      }
    }
  );
  res.render("secondyear",
    {
      username: username,
      email: email,
      picture: picture,
      year: year,
      Books: books2,
      Notes: notes2,
      Papers: papers2,
      cssName
    });
});

/* User Contribution Page */
// FirstYear userResources
app.post("/ufirstyear", async (req, res) => {
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

// SecondYear Resources
app.post("/usecondyear", async (req, res) => {


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
////////////////////////////////////////////////////////////////////////////////////////
/* Course Section */
// Course Section Landing Page
app.get("/courselanding", (req, res) => {
  let pageTitle = "Blogs";
  let cssName = "css/course/courselanding.css";
  let username = "Guest";
  let picture = "https://cdn2.iconfinder.com/data/icons/ios-7-icons/50/user_male2-512.png"; let email = "";
  if (req.isAuthenticated()) {
    username = req.user.name;
    picture = req.user.picture;
    email = req.user.email;
  }
  res.render("courselanding", { title: pageTitle, cssName: cssName, username, picture, email });


});

/////////////////////////////////////////////////////////////////////////////////////////
/* Web Home */
app.get("/webhome", (req, res) => {
  let pageTitle = "Web Development";
  let cssName = "css/course/web/webhome.css";
  let username = "Guest";
  let picture = "https://cdn2.iconfinder.com/data/icons/ios-7-icons/50/user_male2-512.png"; let email = "";
  if (req.isAuthenticated()) {
    username = req.user.name;
    picture = req.user.picture;
    email = req.user.email;
  }
  res.render("web/webhome", { title: pageTitle, cssName: cssName, username, picture, email });

})






app.listen(port, () => {
  console.log(`Server running at  http://${hostname}:${port}/`);
});
