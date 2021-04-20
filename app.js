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

app.use(bodyParser.urlencoded({
  extended: true
}));

//body-parser
app.use(bodyParser.json());
const userSchema = require("./schemas/user");

userSchema.plugin(passportLocalMongoose);
userSchema.plugin(findOrCreate);

const User = require("./models/user");
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
  new GoogleStrategy({
      clientID: process.env.CLIENT_ID,
      clientSecret: process.env.CLIENT_SECRET,
      callbackURL: "http://localhost:3000/auth/google/home",
      userProfileURL: "https://www.googleapis.com/oauth2/v3/userinfo",
    },
    function (accessToken, refreshToken, profile, cb) {
      console.log(profile);
      User.findOrCreate({
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

//ALL MODELS
// Community
const communityUser = require('./models/communityUser');
//userBlog
const userBlog = require("./models/userBlog");
// Contact
const contact = require("./models/contact");
// Feedback
const feedback = require("./models/feedback");
//newsletter Model
const newsletter = require("./models/newsletter");
// contribution record model
const contributionRecord = require("./models/contributionRecord");
//firstYear Model
const firstyearBook = require("./models/firstyear/firstyearBook");
const firstyearNote = require("./models/firstyear/firstyearNote");
const firstyearPapers = require("./models/firstyear/firstyearPapers");
// secondYear model
const secondyearBook = require("./models/secondyear/secondyearBook");
const secondyearNote = require("./models/secondyear/secondyearNote");
const secondyearPapers = require("./models/secondyear/secondyearPapers");
// userContributions

//firstYear Model
const ufirstyearBook = require("./models/firstyear/ufirstyearBook");
const ufirstyearNote = require("./models/firstyear/ufirstyearNote");
const ufirstyearPapers = require("./models/firstyear/ufirstyearPapers");

// secondYear model

const usecondyearBook = require("./models/secondyear/usecondyearBook");
const usecondyearNote = require("./models/secondyear/usecondyearNote");
const usecondyearPapers = require("./models/secondyear/usecondyearPapers");

//Now the profile will be updated only when the user is authenticated


//ALL PATH
const profileRoutes = require("./routes/profile");
app.use("/profile",profileRoutes);

app.get('/auth/google',
  passport.authenticate('google', {
    scope: ['profile', "email"]
  })
);

app.get(
  "/auth/google/home",
  passport.authenticate("google", {
    failureRedirect: "/login"
  }),
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


const joincommunityRoutes = require("./routes/joincommunity");
app.use("/joincommunity",joincommunityRoutes);

const userblogRoutes = require("./routes/userblog");
app.use("/userblog",userblogRoutes);

const contactRoutes = require("./routes/contact");
app.use("/contact",contactRoutes);

const feedbackRoutes = require("./routes/feedback");
app.use("/feedback",feedbackRoutes);

// Newsletter
const newsletterRoutes = require("./routes/newsletter");
app.use("/newsletter",newsletterRoutes);


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
const homeRoutes = require("./routes/home");
app.use("/",homeRoutes);
//////////////////////////////////////////////////////////////////////////////////////////////////////////

// LOGIN PAGE
const loginRoutes = require("./routes/login");
app.use("/login",loginRoutes);
// REGISTER PAGE
app.get("/register", (req, res) => {
  let username = "Guest";
  let picture = "https://cdn2.iconfinder.com/data/icons/ios-7-icons/50/user_male2-512.png";
  let email = "";
  if (req.isAuthenticated()) {
    username = req.user.name;
    picture = req.user.picture;
    email = req.user.email;
  }
  res.render("register", {
    username,
    picture,
    email
  });
});
// RESOURCE PAGE
const resourcesRoutes = require("./routes/resources");
app.use("/resources",resourcesRoutes);

const aboutRoutes = require("./routes/about");
app.use("/about",aboutRoutes);

const privacyRoutes = require("./routes/privacy");
app.use("/privacy",privacyRoutes);

// CONTRIBUTE RESOURCES PAGE
const contributeRoutes = require("./routes/contribute");
app.use("/contribute",contributeRoutes);


// USER CONTRIBUTION SECTION
const usercontributionsRoutes = require("./routes/usercontributions");
app.use("/usercontributions",usercontributionsRoutes);

const datauploadRoutes = require("./routes/dataupload");
app.use("/dataupload",datauploadRoutes);

const myblogRoutes = require("./routes/myblog");
app.use("/myblog",myblogRoutes);

const blogsRoutes = require("./routes/blogs");
app.use("/blogs",blogsRoutes);


// Community
const communityRoutes = require("./routes/community");
app.use("/community",communityRoutes);


// Community Filter
const CommunityFilterRoutes = require("./routes/CommunityFilter");
app.use("/CommunityFilter",CommunityFilterRoutes);



// const secondyearVideos = mongoose.model("secondyearVideos", secondyearSchema)
const ucontributeRoutes = require("./routes/ucontribute");
app.use("/ucontribute",ucontributeRoutes);




// FirstYear Resources

const firstyearRoutes = require("./routes/firstyear");
app.use("/firstyear",firstyearRoutes);


// SecondYear Resources
const secondyearRoutes = require("./routes/secondyear");
app.use("/secondyear",secondyearRoutes);


/* User Contribution Page */
// FirstYear userResources
const ufirstyearRoutes = require("./routes/ufirstyear");
app.use("/ufirstyear",ufirstyearRoutes);


// SecondYear Resources
const usecondyearRoutes = require("./routes/usecondyear");
app.use("/usecondyear",usecondyearRoutes);

////////////////////////////////////////////////////////////////////////////////////////
/* Course Section */
// Course Section Landing Page
const courselandingRoutes = require("./routes/courselanding");
app.use("/courselanding",courselandingRoutes);

app.listen(port, () => {
  console.log(`Server running at  http://${hostname}:${port}/`);
});
