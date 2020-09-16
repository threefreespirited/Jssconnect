//Module Dependences

const express = require('express');
var nodemailer = require('nodemailer');
require("dotenv").config();
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const session = require("express-session");
const passport = require("passport");
const passportLocalMongoose = require("passport-local-mongoose");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const findOrCreate = require("mongoose-findorcreate");

const hostname = '127.0.0.1';
const port = process.env.PORT || '80';

//List of letiables

const app = express();
app.use(session({
  secret: process.env.SECRET,
  resave: false,
  saveUninitialized: false,
}));
app.use(passport.initialize());
app.use(passport.session());




const MONGODB_URI = process.env.MONGODB_URI;
mongoose.connect(MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
});
mongoose.set("useCreateIndex", true);
const db = mongoose.connection;

db.on('connected', () => {
  console.log('Mongoose is connected!');
});

mongoose.set("useCreateIndex", true);
app.use('/public', express.static('public'));
app.use('/views', express.static(__dirname + '/views'));

app.use(bodyParser.urlencoded({ extended: true }));


//body-parser
app.use(bodyParser.json());
const userSchema = new mongoose.Schema({
  email: String,
  picture: String,
  name: String,
  googleId: String
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
passport.use(new GoogleStrategy({
  clientID: process.env.CLIENT_ID,
  clientSecret: process.env.CLIENT_SECRET,
  callbackURL: "https://jssconnect.herokuapp.com/auth/google/home",
  userProfileURL: "https://www.googleapis.com/oauth2/v3/userinfo"
},
  function (accessToken, refreshToken, profile, cb) {
    console.log(profile);
    User.findOrCreate({ googleId: profile.id, name: profile.displayName, picture: profile.photos[0].value, email: profile.emails[0].value }, function (err, user) {

      console.log(user);
      myEmail = user.email;
      return cb(err, user);
    });


  }
));

//Now the profile will be updated only when the user is authenticated

app.get(`/profile/:token`, (req, res) => {
  const token1 = req.params.token;
  console.log("token1");
  console.log(token1);
  passport.authenticate('google', { failureRedirect: '/login' });
  if (req.isAuthenticated()) {

    User.find({ email: token1 }, (err, user) => {
      if (err) {
        console.log(err);
      }
      else {
        res.send(user);
      }
    })
  }
})

app.get('/auth/google',
  passport.authenticate('google', { scope: ['profile', "email"] })
);

app.get('/auth/google/home',
  passport.authenticate('google', { failureRedirect: '/login' }),
  function (req, res) {
    // Successful authentication, redirect home.
    res.redirect(`/?email=${myEmail}`);
  });
app.get('/auth/google/userblog',
  passport.authenticate('google', { failureRedirect: '/login' }),
  function (req, res) {
    // Successful authentication, redirect userblog.
    res.redirect('/userblog');
  });

app.get("/userblog", function (req, res) {
  if (req.isAuthenticated()) {
    res.sendFile(__dirname + "/views/userblog.html");
  }
  else {
    res.redirect("/login");
  }
});

// Contribute Strategy

app.get('/auth/google/contribute',
  passport.authenticate('google', { failureRedirect: '/login' }),
  function (req, res) {
    // Successful authentication, redirect contribute.
    res.redirect('/contribute');
  });

app.get("/contribute", function (req, res) {
  if (req.isAuthenticated()) {
    res.sendFile(__dirname + "/views/contribute.html");
  }
  else {
    res.redirect("/login");
  }
});

app.get("/logout", function (req, res) {
  req.logOut();
  res.redirect("/");
});

// Newsletter

app.post("/newsletter", (req, res) => {
  //Schema
  const Schema = mongoose.Schema;
  const newsletterSchema = new Schema({
    email: { type: String, required: true }
  });

  //Model
  const newsletter = mongoose.model('newsletter', newsletterSchema);
  let newsletter_email = new newsletter(req.body);

  //Newsletter
  let transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.MY_EMAIL,
      pass: process.env.PASS
    }
  });

  let mailOptions = {
    from: process.env.MY_EMAIL,
    to: newsletter_email,
    subject: 'Thanks for subscribing : Jssconnect Team',
    text: 'Thanks for subsciing to Jssconnect. Now you will get regular updates for every event and update.'
  }

  transporter.sendMail(mailOptions, function (error, info) {
    if (error) {
      console.log(error);
    } else {
      console.log('Email sent: ' + info.response);
    }
  });

  res.writeHead(200, { 'Content-Type': 'text/html' });
  var writeText = "<img src='https://cdn.pixabay.com/photo/2016/09/01/08/24/smiley-1635449__340.png' style='margin:60px 42%; width:200px;'><p style='text-align:center;font-size:1.8rem;margin-top:60px;'>Thanks for subscibing!<br>You will now get regular updates from Jssconnect.</p><a href='/'style='text-align:center;margin-left:46%;'><button style='font-size:1.5rem;padding:6px;border-radius:10px;background-color:aliceblue;cursor:pointer;'>Get Back</button></a>";

  res.write(writeText);
  res.end();

});


//first year Schema
const firstyearSchema = new mongoose.Schema({
  resname: String,
  authorName: String,
  department: String,
  subject: String,
  link: String
});
const firstyearPaperSchema = new mongoose.Schema({
  resname: String,
  year: Number,
  department: String,
  subject: String,
  link: String
});
//second year Schema
const secondyearSchema = new mongoose.Schema({
  resname: String,
  authorName: String,
  department: String,
  subject: String,
  link: String
});
const secondyearPaperSchema = new mongoose.Schema({
  resname: String,
  year: Number,
  department: String,
  subject: String,
  link: String
});

app.post("/feedback", (req,res)=>{
    res.writeHead(200, { 'Content-Type': 'text/html' });
     res.write("<img src='https://cdn.pixabay.com/photo/2016/09/01/08/24/smiley-1635449__340.png' style='margin:60px 42%; width:200px;'><p style='text-align:center;font-size:1.8rem;margin-top:60px;'>Thanks for taking out your precious time!<br>Your feedback means a lot to us.</p><a href='/'style='text-align:center;margin-left:46%;'><button style='font-size:1.5rem;padding:6px;border-radius:10px;background-color:aliceblue;cursor:pointer;'>Get Back</button></a>")
     res.end();
    });

//firstYear Model
const firstyearBook = mongoose.model('firstyearBook', firstyearSchema);
const firstyearNote = mongoose.model("firstyearNote", firstyearSchema)
const firstyearPapers = mongoose.model("firstyearPapers", firstyearPaperSchema)
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

const secondyearBook = mongoose.model('secondyearBook', secondyearSchema);
const secondyearNote = mongoose.model("secondyearNote", secondyearSchema);
const secondyearPapers = mongoose.model("secondyearPapers", secondyearPaperSchema);
// const secondyearVideos = mongoose.model("secondyearVideos", secondyearSchema)

// app.post("/contribute", (req, res) => {
//   // const secondyearBook1 = new secondyearBook(req.body);
//   // const secondyearNote1 = new secondyearNote(req.body);
//   // const secondyearPapers1 = new secondyearPapers(req.body);
//   // const secondyearVideos1 = new secondyearVideos(req.body);

//   // secondyearBook1.save();
//   // secondyearNote1.save();
//   // secondyearPapers1.save();
//   // secondyearVideos1.save();
// })

app.get("/", (req, res) => {
  res.sendFile(__dirname + "/views/index.html");
})
app.get("/contact", (req, res) => {
  res.sendFile(__dirname + "/views/contact.html");
})
app.get("/login", (req, res) => {
  res.sendFile(__dirname + "/views/login.html");
})
app.get("/login.css", (req, res) => {
  res.sendFile(__dirname + "/views/login.css");
})
app.get("/profile.css", (req, res) => {
  res.sendFile(__dirname + "/views/profile.css");
})
app.get("/register", (req, res) => {
  res.sendFile(__dirname + "/views/register.html");
})
app.get("/resources", (req, res) => {
  res.sendFile(__dirname + "/views/resource.html");
})
app.get("/about", (req, res) => {
  res.sendFile(__dirname + "/views/about.html");
})
app.get("/privacy", (req, res) => {
  res.sendFile(__dirname + "/views/privacy.html");
})
app.get("/contribute", (req, res) => {
  res.sendFile(__dirname + "/views/contribute.html");
})
app.get("/myblog", (req, res) => {
  res.sendFile(__dirname + "/views/blog.html");
})
app.get("/blogs", (req, res) => {
  res.sendFile(__dirname + "/views/blogs.html");
})
app.get("/userblog", (req, res) => {
  res.sendFile(__dirname + "/views/userblog.html");
})
app.get("/usercontributions", (req, res) => {
  res.sendFile(__dirname + "/views/usercontributions.html");
})
app.get("/feedback", (req, res) => {
  res.sendFile(__dirname + "/views/feedback.html");
})
app.get("/dataupload", (req, res) => {
  res.sendFile(__dirname + "/views/dataUpload.html");
})
app.get("/index.css", (req, res) => {
  res.sendFile(__dirname + "/views/index.css");
})
app.get("/team.css", (req, res) => {
  res.sendFile(__dirname + "/views/team.css");
})
app.get("/blogs.js", (req, res) => {
  res.sendFile(__dirname + "/views/blogs.js");
})

// userContributions


//firstYear Model
const ufirstyearBook = mongoose.model('ufirstyearBook', firstyearSchema);
const ufirstyearNote = mongoose.model("ufirstyearNote", firstyearSchema)
const ufirstyearPapers = mongoose.model("ufirstyearPapers", firstyearPaperSchema)

// secondYear model

const usecondyearBook = mongoose.model('usecondyearBook', secondyearSchema);
const usecondyearNote = mongoose.model("usecondyearNote", secondyearSchema);
const usecondyearPapers = mongoose.model("usecondyearPapers", secondyearPaperSchema);
// const secondyearVideos = mongoose.model("secondyearVideos", secondyearSchema)

app.post("/ucontribute", (req, res) => {

  // const bName = req.body.resname;
  // const author = req.body.authorName;
  const year = req.body.year;
  // const departement = req.body.department;
  // const subject = req.body.subject;
  // const link = req.body.link;
  // const username = req.body.username;
  const type = req.body.type;
  console.log(type);
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
  }
  else if (year == "2") {
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

  // res.writeHead(200, { 'Content-Type': 'text/html' });
  res.sendFile(__dirname + "/views/usercontributions.html");

  // usecondyearBook1.save();
  // usecondyearNote1.save();

})

// FirstYear Resources
app.post("/firstyear", (req, res) => {

  let navbar = `
        <!DOCTYPE html>
        <html lang="en">
        
        <head>
          <meta charset="UTF-8" />
          <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        
        
          <!-- Compiled and minified CSS -->
          <link href="https://fonts.googleapis.com/icon?family=Material+Icons" rel="stylesheet" />
          <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/materialize/1.0.0/css/materialize.min.css" />
        
          <!-- Compiled and minified JavaScript -->
          <script src="https://cdnjs.cloudflare.com/ajax/libs/materialize/1.0.0/js/materialize.min.js"></script>
        
        
          <!--Google fonts-->
          <link href="https://fonts.googleapis.com/css2?family=Cairo&display=swap" rel="stylesheet">
          <link rel="stylesheet" href="/index.css" />
          <!--Font Awesome-->
          <script src="https://kit.fontawesome.com/efd71d3ed7.js" crossorigin="anonymous"></script>

          <link rel="icon" href="https://www.freelogoservices.com/api/main/images/1j+ojFVDOMkX9Wytexe43D6kifODqxBHnRbIwXs1M3EMoAJtlSkkjvBt9Ps+" style="width: 16px;height:16px;" type="image/x-icon">
          <title>JSS Connect</title>
          <style>
              .booksBox,.notesBox{
                  border: 4px solid gray;
                  border-radius: 4px;
                  border-bottom-right-radius:35px;
                  box-shadow:4px 8px 2px 1px gray;
                  border-bottom-width:5px;
                  border-bottom-color: #006a71;
                  background:linear-gradient(to bottom left,#006a71,#e4e3e3);
                  margin:20px;
                  margin-left:50px;
                  width:200px;
                  height:200px;
                  padding:12px;
                  color:white;
                  text-align:center;
                }
              .notesBox{
                
                background: rgb(2,0,36);
                background: linear-gradient(90deg, rgba(2,0,36,1) 0%, rgba(9,121,105,1) 34%, rgba(0,212,255,1) 100%);
              }
              .booksGrid{
                  margin-top:40px;
                  padding: 0 60px;
                  display:grid;
                  grid-template-columns: repeat(4,1fr);
              }


        
.Bthree{
    width:200px;
    height:240px;
    box-shadow: 0px 0px 10px 0px black;
    border-left:10px solid #3b6978;
    margin:15px;
    margin-top: 40px;
    border-top-right-radius: 4px;
    border-bottom-right-radius: 4px;
}

.Btwo{
    width:160px;
    height:190px;
    background-color:#204051;
    text-align:center;
    position: relative;
    border-top-right-radius: 4px;
    border-bottom-right-radius: 4px;
}
.Bone{
    width:135px;
    border: 3px solid white;
    position: absolute;
    bottom: 25px;
    left: 12px;
    border-radius: 6px;
    font-size:15px;
    background-color:white;
}

.Bthree:hover{
    transform: rotate(-6deg);
    transition: 0.3s;
}
.resLink{
  width:fit-content;
  height:fit-content;
}

@media screen and (max-width:1000px){
  .booksGrid{
    padding: 0 10%;
    grid-template-columns: repeat(2,1fr);
}
}
@media screen and (max-width:540px){
  .booksGrid{
    padding: 0 10%;
    grid-template-columns: repeat(1,1fr);
}
}

.myFloatingBtn:hover {
	transform: rotate(360deg);
	transition: 0.7s linear all;
}
          </style>
        </head>
        
        <body>
        <nav id="navbar" style="background-color: #2c7873;font-family: 'Cairo', sans-serif;">
        <div class="nav-wrapper">
        <a href="/" class="brand-logo"><img src="https://www.freelogoservices.com/api/main/images/1j+ojFVDOMkX9Wytexe43D6kifODqxBHnRbIwXs1M3EMoAJtlSkkjvBt9Ps+" alt="" style="width: 75px;margin-top: 7px;filter: invert();" /></a>
        <a href="/" class="brand-logo" id="logoText" style="margin-left: 75px; font-size: 2rem">JSS Connect</a>
        <a href="#" data-target="mobile-demo" class="sidenav-trigger"><i class="material-icons">menu</i></a>
        <ul id="main-menu" class="right hide-on-med-and-down">
          <li><a href="/blogs">Blogs</a></li>
          <li><a href="/resources">Resources</a></li>
          <li><a href="/contribute">Contribute</a></li>
          <li><a href="/contact">Contact</a></li>
         <!-- <li><a href="/register">Register</a></li>
          <li><a href="/login">Login</a></li> -->
        </ul>
      </div>
    </nav>
  
    <ul class="sidenav" id="mobile-demo" style="background-color: #2c7873;">
      <br />
      <li><a href="/blogs" style=" color: white;">Blogs</a></li>
      <li><a href="/resources" style=" color: white;">Resources</a></li>
      <li><a href="/contribute" style=" color: white;">Contribute</a></li>
      <li><a href="/contact" style=" color: white;">Contact</a></li>
      <!-- <li><a href="/register" style=" color: white;">Register</a></li>
      <li><a href="/login" style=" color: white;">Login</a></li> -->
    </ul>
          <div id="wave" style="margin-top: 50px;">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 320"><path fill="#2c7873" fill-opacity="1" d="M0,288L60,256C120,224,240,160,360,144C480,128,600,160,720,181.3C840,203,960,213,1080,218.7C1200,224,1320,224,1380,224L1440,224L1440,0L1380,0C1320,0,1200,0,1080,0C960,0,840,0,720,0C600,0,480,0,360,0C240,0,120,0,60,0L0,0Z"></path></svg>
          </div>
              <h2 style="margin-top:-15px;margin-bottom:0px;text-align: center;color: black;">First Year</h2>
              <h3 style="margin-top:45px;margin-left:6%;color:#64958f">Books</h3>
          <div class="booksGrid">
          `;
  let footer = `
            </div>
          
  <!-- Floating button -->

  <div class="fixed-action-btn" id="myFl">
    <a class="btn-floating btn-large black myFloatingBtn">
      <img src="public/images/logo.png" alt="" style="width: 60px;margin: 10px -1px;filter: invert();" />
    </a>
    <ul>
      <li><a href="/contact#team" class="btn-floating green myFloat">Team</a>
      </li>
      <li><a href="http://jsswire.herokuapp.com" class="btn-floating red myFloat">
        
        <img src="public/images/share.png" alt="" style="width: 30px;margin: 6px -1px;filter: invert();" />
      </a>
      </li>

      <li style="margin: 12px 0px;">

        <a class="btn-floating btn-large black" id="brightness">
          <i class="fa fa-moon-o" style="color: white;"></i>
        </a>

      </li>

    </ul>
  </div>

  <!-- Footer -->

  <!-- <footer class="page-footer" style="background-color: #1a1a1a;margin-top:36px;"> -->
  <footer class="page-footer" style="background-color: #323232;margin-top:36px;">
    <div class="container">
      <div class="row">
        <div style="text-align: center;margin: 75px 0;">
          <h2>Let’s stay connected.</h2>
          <form action="/newsletter" method="POST" style="margin: 30px 0px;">
            <input type="email" name="email" required placeholder="Enter your Email"
              style="width:40%;margin-right: 20px;color: white;" required>
            <button id="newsBtn" type="submit">Subscribe</button>
          </form>
          <p>Sign up to receive our newsletter and exclusive updates.</p>
          <div style="margin-top: 45px;">
            <a href="https://www.facebook.com/JssAcademyOfTechnicalEducationnoida/" class="socials"
              style="color: #1b6ca8;"><i class="fa fa-facebook-official"></i></a>
            <a href="https://twitter.com/jssatenoida?lang=en" class="socials" style="color: #3282b8;"><i
                class="fa fa-twitter-square"></i></a>
          </div>
        </div>
        <hr>
        <div class="col l3 offset-l1 s6">
          <h5 class="white-text">Quick Links</h5>
          <ul>
            <li><a class="grey-text text-lighten-3" href="/blogs">Blogs</a></li>
            <li><a class="grey-text text-lighten-3" href="/resources">Ebooks</a></li>
            <li><a class="grey-text text-lighten-3" href="/usercontributions">User Contributions</a></li>
            <li><a class="grey-text text-lighten-3" href="http://jsswire.herokuapp.com">Connect with wire</a></li>
            <li><a class="grey-text text-lighten-3" href="/contribute">Contribute</a></li>
          </ul>
        </div>
        <div class="col l3 offset-l1 s6">
          <h5 class="white-text">Recent Blogs</h5>
          <ul>
            <li><a class="grey-text text-lighten-3" href="/blogs">What to do when entering a college?</a></li>
            <li><a class="grey-text text-lighten-3" href="/blogs">What I Learned My Freshman Year of College</a></li>
            <li><a class="grey-text text-lighten-3" href="/blogs">A glimpse into Async JavaScript</a></li>
          </ul>
        </div>
        <div class="col l3 offset-l1 s6">
          <h5 class="white-text">Contact</h5>
          <ul>
            <li><a class="grey-text text-lighten-3" href="/contact">Contact Us</a></li>
            <li><a class="grey-text text-lighten-3" href="/contact#team">Our Team</a></li>
            <li><a class="grey-text text-lighten-3" href="/feedback">Feedback</a></li>
          </ul>
        </div>

      </div>
    </div>
    <div class="footer-copyright">
      <div class="container">
        <span>© &nbsp; jssconnect.herokuapp.com &nbsp; 2020</span>
        <span style="margin-left: 20%;">JSSconnnect</span>
        <a class="grey-text text-lighten-4 right" href="/privacy">Privacy Policy</a>
      </div>
    </div>
  </footer>

      
      
        <script>
          // JS for floating buuton
      
          document.addEventListener('DOMContentLoaded', function () {
            let elems = document.querySelectorAll('.fixed-action-btn');
            let instances = M.FloatingActionButton.init(elems);
          });
      
          document.addEventListener('DOMContentLoaded', function () {
            let elems = document.querySelectorAll('.sidenav');
            let instances = M.Sidenav.init(elems);
          });
       const brightness = document.getElementById('brightness');
    const foot = document.querySelector("footer");
    const navbar = document.querySelector("nav"); 
  const sidenav = document.querySelector('.sidenav');
    let count = 0;
    brightness.addEventListener("click", () => {

      if (count < 1) {
        count = 1;
        localStorage.setItem("theme", "dark");
        
      }
      else if (count == 1) {
        count = 0;
        localStorage.setItem("theme", "light");
      }
      setTheme();
    })


    function setTheme() {

      const currentTheme = localStorage.getItem("theme");
      if (currentTheme == "dark") {
        foot.style.backgroundColor = "#1b262c"
        navbar.style.backgroundColor = "#1b262c";
        brightness.innerHTML = "<i class='fa fa-sun-o' style='color: goldenrod;'></i>"
        sidenav.style.backgroundColor = "#1b262c";
      }
      else {
        foot.style.backgroundColor = "#323232"
        navbar.style.backgroundColor = "#2c7873";
        sidenav.style.backgroundColor = "#2c7873";
        brightness.innerHTML = "<i class='fa fa-moon-o' style='color: white;'></i>"
      }
    }
      
        </script>
      
      
      </body>
      
      </html>`;

  const department = req.body.department;
  const subject = req.body.subject;

  let books1 = "";
  firstyearBook.find({ subject: subject }, function (err, found) {
    if (err) {
      console.log(err)
    } else {

      for (let i = 0; i < found.length; i++) {
        books1 += `
                       
                   <a href="${found[i].link}" class="resLink">
                   <div class="Bthree">
                  <div class="Btwo">
                  <p style="font-weight:bold;font-size:1.2rem;padding-top:20px;color:white;">${found[i].resname}</p>
                  <div class="Bone">
                  <p style="margin:0;color:#204051;font-weight: 500;padding:0 2px;">${found[i].authorName}</p>
                  </div>
                  </div>
                  </div>
                  </a>  
          `;

      }
    }

  })
  let notes1 = "";
  firstyearNote.find({ subject: subject }, function (err, found) {
    if (err) {
      console.log(err)
    } else {

      for (let i = 0; i < found.length; i++) {
        notes1 += `
        <a href="${found[i].link}" class="resLink">
        <div class="Bthree" style="border-color:#596157;">
        <div class="Btwo" style="background-color:#5b8c5a">
       <p style="font-weight:bold;font-size:1.2rem;padding-top:20px;color:white;">${found[i].resname}</p>
       <div class="Bone">
       <p style="margin:0;color:#5b8c5a;font-weight: 500;padding:0 2px;">${found[i].authorName}</p>
       </div>
       </div>
       </div>
       </a>  
               `;

      }

    }
  })
  let papers1 = "";
  firstyearPapers.find({ subject: subject }, function (err, found) {
    if (err) {
      console.log(err);
      res.write("<img src='https://i7.pngguru.com/preview/638/430/452/drawing-clip-art-not-found.jpg' alt='NOT FOUND' style='width:45%;'>");
      res.send();
    } else {

      for (let i = 0; i < found.length; i++) {
        papers1 += `
                <a href="${found[i].link}" class="resLink">
                <div class="Bthree" style="border-color:#434e52;">
                <div class="Btwo" style="background-color:#ff2e63">
               <p style="font-weight:bold;font-size:1.2rem;padding-top:20px;color:white;">${found[i].resname}</p>
               <div class="Bone">
               <p style="margin:0;color:#ff2e63;font-weight: 500;padding:0 2px;">${found[i].year}</p>
               </div>
               </div>
               </div>
               </a>  
               `;

      }

    }

    let total = navbar + books1 + "</div> <h3 style='margin-top:60px;margin-bottom:0;margin-left:6%;color:#81b214;'>Notes</h3><div class='booksGrid'>" + notes1 + "</div>" + "<h3 style='margin-top:60px;margin-bottom:0;margin-left:6%;color:#81b214;'>Previous year papers</h3><div class='booksGrid'>" + papers1 + "</div>" + footer;
    res.write(total);
    res.send();
  })
});

// SecondYear Resources
app.post("/secondyear", (req, res) => {

  let navbar = `<!DOCTYPE html>
        <html lang="en">
        
        <head>
          <meta charset="UTF-8" />
          <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        
        
          <!-- Compiled and minified CSS -->
          <link href="https://fonts.googleapis.com/icon?family=Material+Icons" rel="stylesheet" />
          <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/materialize/1.0.0/css/materialize.min.css" />
        
          <!-- Compiled and minified JavaScript -->
          <script src="https://cdnjs.cloudflare.com/ajax/libs/materialize/1.0.0/js/materialize.min.js"></script>
        
        
          <!--Google fonts-->
          <link href="https://fonts.googleapis.com/css2?family=Cairo&display=swap" rel="stylesheet">
          <link rel="stylesheet" href="/index.css" />
          <!--Font Awesome-->
          <script src="https://kit.fontawesome.com/efd71d3ed7.js" crossorigin="anonymous"></script>

          <link rel="icon" href="https://www.freelogoservices.com/api/main/images/1j+ojFVDOMkX9Wytexe43D6kifODqxBHnRbIwXs1M3EMoAJtlSkkjvBt9Ps+" width="10" height="10" type="image/x-icon">
          <title>JSS Connect</title>
          <style>
              .booksBox,.notesBox{
                  border: 4px solid gray;
                  border-radius: 4px;
                  border-bottom-right-radius:35px;
                  box-shadow:4px 8px 2px 1px gray;
                  border-bottom-width:5px;
                  border-bottom-color: #006a71;
                  background:linear-gradient(to bottom left,#006a71,#e4e3e3);
                  margin:20px;
                  margin-left:50px;
                  width:200px;
                  height:200px;
                  padding:12px;
                  color:white;
                  text-align:center;
                }
              .notesBox{
                
                background: rgb(2,0,36);
                background: linear-gradient(90deg, rgba(2,0,36,1) 0%, rgba(9,121,105,1) 34%, rgba(0,212,255,1) 100%);
              }
              .booksGrid{
                  margin-top:40px;
                  padding: 0 60px;
                  display:grid;
                  grid-template-columns: repeat(4,1fr);
              }


        
.Bthree{
    width:200px;
    height:240px;
    box-shadow: 0px 0px 10px 0px black;
    border-left:10px solid #3b6978;
    margin:15px;
    margin-top: 40px;
    border-top-right-radius: 4px;
    border-bottom-right-radius: 4px;
}

.Btwo{
    width:160px;
    height:190px;
    background-color:#204051;
    text-align:center;
    position: relative;
    border-top-right-radius: 4px;
    border-bottom-right-radius: 4px;
}
.Bone{
    width:135px;
    border: 3px solid white;
    position: absolute;
    bottom: 25px;
    left: 12px;
    border-radius: 6px;
    font-size:15px;
    background-color:white;
}

.Bthree:hover{
    transform: rotate(-6deg);
    transition: 0.3s;
}
.resLink{
  width:fit-content;
  height:fit-content;
}

@media screen and (max-width:1000px){
  .booksGrid{
    padding: 0 10%;
    grid-template-columns: repeat(2,1fr);
}
}
@media screen and (max-width:540px){
  .booksGrid{
    padding: 0 10%;
    grid-template-columns: repeat(1,1fr);
}
}

.myFloatingBtn:hover {
	transform: rotate(360deg);
	transition: 0.7s linear all;
}
          </style>
        </head>
        
        <body>
        <nav id="navbar" style="background-color: #2c7873;font-family: 'Cairo', sans-serif;">
        <div class="nav-wrapper">
        <a href="/" class="brand-logo"><img src="https://www.freelogoservices.com/api/main/images/1j+ojFVDOMkX9Wytexe43D6kifODqxBHnRbIwXs1M3EMoAJtlSkkjvBt9Ps+" alt="" style="width: 75px;margin-top: 7px;filter: invert();" /></a>
        <a href="/" class="brand-logo" id="logoText" style="margin-left: 75px; font-size: 2rem">JSS Connect</a>
        <a href="#" data-target="mobile-demo" class="sidenav-trigger"><i class="material-icons">menu</i></a>
        <ul id="main-menu" class="right hide-on-med-and-down">
          <li><a href="/blogs">Blogs</a></li>
          <li><a href="/resources">Resources</a></li>
          <li><a href="/contribute">Contribute</a></li>
          <li><a href="/contact">Contact</a></li>
          <!-- <li><a href="/register">Register</a></li>
          <li><a href="/login">Login</a></li> -->
        </ul>
      </div>
    </nav>
  
    <ul class="sidenav" id="mobile-demo" style="background-color: #2c7873;">
      <br />
      <li><a href="/blogs" style=" color: white;">Blogs</a></li>
      <li><a href="/resources" style=" color: white;">Resources</a></li>
      <li><a href="/contribute" style=" color: white;">Contribute</a></li>
      <li><a href="/contact" style=" color: white;">Contact</a></li>
      <!-- <li><a href="/register">Register</a></li>
      <li><a href="/login">Login</a></li> -->
    </ul>
      <div id="wave" style="margin-top: 50px;">
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 320"><path fill="#2c7873" fill-opacity="1" d="M0,288L60,256C120,224,240,160,360,144C480,128,600,160,720,181.3C840,203,960,213,1080,218.7C1200,224,1320,224,1380,224L1440,224L1440,0L1380,0C1320,0,1200,0,1080,0C960,0,840,0,720,0C600,0,480,0,360,0C240,0,120,0,60,0L0,0Z"></path></svg>
      </div>
          <h2 style="margin-top:-15px;margin-bottom:0px;text-align: center;color: black;">Second Year</h2>
          <h3 style="margin-top:45px;margin-left:6%;color:#64958f">Books</h3>
          <div class="booksGrid">
          `;
  let footer = `
            </div>
          
  <!-- Floating button -->

  <div class="fixed-action-btn" id="myFl">
    <a class="btn-floating btn-large black myFloatingBtn">
      <img src="public/images/logo.png" alt="" style="width: 60px;margin: 10px -1px;filter: invert();" />
    </a>
    <ul>
      <li><a href="/contact#team" class="btn-floating green myFloat">Team</a>
      </li>
      <li><a href="http://jsswire.herokuapp.com" class="btn-floating red myFloat">
        
        <img src="public/images/share.png" alt="" style="width: 30px;margin: 6px -1px;filter: invert();" />
      </a>
      </li>

      <li style="margin: 12px 0px;">

        <a class="btn-floating btn-large black" id="brightness">
          <i class="fa fa-moon-o" style="color: white;"></i>
        </a>

      </li>

    </ul>
  </div>

  <!-- Footer -->

  <!-- <footer class="page-footer" style="background-color: #1a1a1a;margin-top:36px;"> -->
  <footer class="page-footer" style="background-color: #323232;margin-top:36px;">
    <div class="container">
      <div class="row">
        <div style="text-align: center;margin: 75px 0;">
          <h2>Let’s stay connected.</h2>
          <form action="/newsletter" method="POST" style="margin: 30px 0px;">
            <input type="email" name="email" required placeholder="Enter your Email"
              style="width:40%;margin-right: 20px;color: white;" required>
            <button id="newsBtn" type="submit">Subscribe</button>
          </form>
          <p>Sign up to receive our newsletter and exclusive updates.</p>
          <div style="margin-top: 45px;">
            <a href="https://www.facebook.com/JssAcademyOfTechnicalEducationnoida/" class="socials"
              style="color: #1b6ca8;"><i class="fa fa-facebook-official"></i></a>
            <a href="https://twitter.com/jssatenoida?lang=en" class="socials" style="color: #3282b8;"><i
                class="fa fa-twitter-square"></i></a>
          </div>
        </div>
        <hr>
        <div class="col l3 offset-l1 s6">
          <h5 class="white-text">Quick Links</h5>
          <ul>
            <li><a class="grey-text text-lighten-3" href="/blogs">Blogs</a></li>
            <li><a class="grey-text text-lighten-3" href="/resources">Ebooks</a></li>
            <li><a class="grey-text text-lighten-3" href="/usercontributions">User Contributions</a></li>
            <li><a class="grey-text text-lighten-3" href="http://jsswire.herokuapp.com">Connect with wire</a></li>
            <li><a class="grey-text text-lighten-3" href="/contribute">Contribute</a></li>
          </ul>
        </div>
        <div class="col l3 offset-l1 s6">
          <h5 class="white-text">Recent Blogs</h5>
          <ul>
            <li><a class="grey-text text-lighten-3" href="/blogs">What to do when entering a college?</a></li>
            <li><a class="grey-text text-lighten-3" href="/blogs">What I Learned My Freshman Year of College</a></li>
            <li><a class="grey-text text-lighten-3" href="/blogs">A glimpse into Async JavaScript</a></li>
          </ul>
        </div>
        <div class="col l3 offset-l1 s6">
          <h5 class="white-text">Contact</h5>
          <ul>
            <li><a class="grey-text text-lighten-3" href="/contact">Contact Us</a></li>
            <li><a class="grey-text text-lighten-3" href="/contact#team">Our Team</a></li>
            <li><a class="grey-text text-lighten-3" href="/feedback">Feedback</a></li>
          </ul>
        </div>

      </div>
    </div>
    <div class="footer-copyright">
      <div class="container">
        <span>© &nbsp; jssconnect.herokuapp.com &nbsp; 2020</span>
        <span style="margin-left: 20%;">JSSconnnect</span>
        <a class="grey-text text-lighten-4 right" href="/privacy">Privacy Policy</a>
      </div>
    </div>
  </footer>

      
        <script>
          // JS for floating buuton
      
          document.addEventListener('DOMContentLoaded', function () {
            let elems = document.querySelectorAll('.fixed-action-btn');
            let instances = M.FloatingActionButton.init(elems);
          });
      
          document.addEventListener('DOMContentLoaded', function () {
            let elems = document.querySelectorAll('.sidenav');
            let instances = M.Sidenav.init(elems);
          });
      
           const brightness = document.getElementById('brightness');
    const foot = document.querySelector("footer");
    const navbar = document.querySelector("nav"); 
  const sidenav = document.querySelector('.sidenav');
    let count = 0;
    brightness.addEventListener("click", () => {

      if (count < 1) {
        count = 1;
        localStorage.setItem("theme", "dark");
        
      }
      else if (count == 1) {
        count = 0;
        localStorage.setItem("theme", "light");
      }
      setTheme();
    })


    function setTheme() {

      const currentTheme = localStorage.getItem("theme");
      if (currentTheme == "dark") {
        foot.style.backgroundColor = "#1b262c"
        navbar.style.backgroundColor = "#1b262c";
        brightness.innerHTML = "<i class='fa fa-sun-o' style='color: goldenrod;'></i>"
        sidenav.style.backgroundColor = "#1b262c";
      }
      else {
        foot.style.backgroundColor = "#323232"
        navbar.style.backgroundColor = "#2c7873";
        sidenav.style.backgroundColor = "#2c7873";
        brightness.innerHTML = "<i class='fa fa-moon-o' style='color: white;'></i>"
      }
    }
      
        </script>
      
      
      </body>
      
      </html>`;

  const department = req.body.department;
  const subject = req.body.subject;

  let books1 = "";
  secondyearBook.find({ department: department, subject: subject }, function (err, found) {
    if (err) {
      console.log(err)
    } else {

      for (let i = 0; i < found.length; i++) {
        books1 += `
                       
                   <a href="${found[i].link}" class="resLink">
                   <div class="Bthree">
                  <div class="Btwo">
                   <p style="font-weight:bold;font-size:1.2rem;padding-top:20px;color:white;">${found[i].resname}</p>
                  <div class="Bone">
                  <p style="margin:0;color:#204051;font-weight: 500;padding:0 2px;">${found[i].authorName}</p>
                  </div>
                  </div>
                  </div>
                  </a>  
          `;

      }
    }

  })
  let notes1 = "";
  secondyearNote.find({ subject: subject }, function (err, found) {
    if (err) {
      console.log(err)
    } else {

      for (let i = 0; i < found.length; i++) {
        notes1 += `
        <a href="${found[i].link}" class="resLink">
        <div class="Bthree" style="border-color:#596157;">
        <div class="Btwo" style="background-color:#5b8c5a">
       <p style="font-weight:bold;font-size:1.2rem;padding-top:20px;color:white;">${found[i].resname}</p>
       <div class="Bone">
       <p style="margin:0;color:#5b8c5a;font-weight: 500;padding:0 2px;">${found[i].authorName}</p>
       </div>
       </div>
       </div>
       </a>  
               `;

      }

    }
  })
  let papers1 = "";
  secondyearPapers.find({ subject: subject }, function (err, found) {
    if (err) {
      console.log(err);
      res.write("<img src='https://i7.pngguru.com/preview/638/430/452/drawing-clip-art-not-found.jpg' alt='NOT FOUND' style='width:45%;'>");
      res.send();
    } else {

      for (let i = 0; i < found.length; i++) {
        papers1 += `
                <a href="${found[i].link}" class="resLink">
                <div class="Bthree" style="border-color:#434e52;">
                <div class="Btwo" style="background-color:#ff2e63">
               <p style="font-weight:bold;font-size:1.2rem;padding-top:20px;color:white;">${found[i].resname}</p>
               <div class="Bone">
               <p style="margin:0;color:#ff2e63;font-weight: 500;padding:0 2px;">${found[i].year}</p>
               </div>
               </div>
               </div>
               </a>  
               `;

      }

    }

    let total = navbar + books1 + "</div> <h3 style='margin-top:60px;margin-bottom:0;margin-left:6%;color:#81b214;'>Notes</h3><div class='booksGrid'>" + notes1 + "</div>" + "<h3 style='margin-top:60px;margin-bottom:0;margin-left:6%;color:#81b214;'>Previous year papers</h3><div class='booksGrid'>" + papers1 + "</div>" + footer;
    res.write(total);
    res.send();
  })
});

/* User Contribution Page */
// FirstYear userResources
app.post("/ufirstyear", (req, res) => {

  let navbar = `
        <!DOCTYPE html>
        <html lang="en">
        
        <head>
          <meta charset="UTF-8" />
          <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        
        
          <!-- Compiled and minified CSS -->
          <link href="https://fonts.googleapis.com/icon?family=Material+Icons" rel="stylesheet" />
          <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/materialize/1.0.0/css/materialize.min.css" />
        
          <!-- Compiled and minified JavaScript -->
          <script src="https://cdnjs.cloudflare.com/ajax/libs/materialize/1.0.0/js/materialize.min.js"></script>
        
        
          <!--Google fonts-->
          <link href="https://fonts.googleapis.com/css2?family=Cairo&display=swap" rel="stylesheet">
          <link rel="stylesheet" href="/index.css" />
          <!--Font Awesome-->
          <script src="https://kit.fontawesome.com/efd71d3ed7.js" crossorigin="anonymous"></script>

          <link rel="icon" href="https://www.freelogoservices.com/api/main/images/1j+ojFVDOMkX9Wytexe43D6kifODqxBHnRbIwXs1M3EMoAJtlSkkjvBt9Ps+" style="width: 16px;height:16px;" type="image/x-icon">
          <title>JSS Connect | Contributions</title>
          <style>
              .booksBox,.notesBox{
                  border: 4px solid gray;
                  border-radius: 4px;
                  border-bottom-right-radius:35px;
                  box-shadow:4px 8px 2px 1px gray;
                  border-bottom-width:5px;
                  border-bottom-color: #006a71;
                  background:linear-gradient(to bottom left,#006a71,#e4e3e3);
                  margin:20px;
                  margin-left:50px;
                  width:200px;
                  height:200px;
                  padding:12px;
                  color:white;
                  text-align:center;
                }
              .notesBox{
                
                background: rgb(2,0,36);
                background: linear-gradient(90deg, rgba(2,0,36,1) 0%, rgba(9,121,105,1) 34%, rgba(0,212,255,1) 100%);
              }
              .booksGrid{
                  margin-top:40px;
                  padding: 0 60px;
                  display:grid;
                  grid-template-columns: repeat(4,1fr);
              }


        
.Bthree{
    width:200px;
    height:240px;
    box-shadow: 0px 0px 10px 0px black;
    border-left:10px solid #3b6978;
    margin:15px;
    margin-top: 40px;
    border-top-right-radius: 4px;
    border-bottom-right-radius: 4px;
}

.Btwo{
    width:160px;
    height:190px;
    background-color:#204051;
    text-align:center;
    position: relative;
    border-top-right-radius: 4px;
    border-bottom-right-radius: 4px;
}
.Bone{
    width:135px;
    border: 3px solid white;
    position: absolute;
    bottom: 25px;
    left: 12px;
    border-radius: 6px;
    font-size:15px;
    background-color:white;
}

.Bthree:hover{
    transform: rotate(-6deg);
    transition: 0.3s;
}
.resLink{
  width:fit-content;
  height:fit-content;
}

@media screen and (max-width:1000px){
  .booksGrid{
    padding: 0 10%;
    grid-template-columns: repeat(2,1fr);
}
}
@media screen and (max-width:540px){
  .booksGrid{
    padding: 0 10%;
    grid-template-columns: repeat(1,1fr);
}
}

.myFloatingBtn:hover {
	transform: rotate(360deg);
	transition: 0.7s linear all;
}
          </style>
        </head>
        
        <body>
        <nav id="navbar" style="background-color: #2c7873;font-family: 'Cairo', sans-serif;">
        <div class="nav-wrapper">
        <a href="/" class="brand-logo"><img src="https://www.freelogoservices.com/api/main/images/1j+ojFVDOMkX9Wytexe43D6kifODqxBHnRbIwXs1M3EMoAJtlSkkjvBt9Ps+" alt="" style="width: 75px;margin-top: 7px;filter: invert();" /></a>
        <a href="/" class="brand-logo" id="logoText" style="margin-left: 75px; font-size: 2rem">JSS Connect</a>
        <a href="#" data-target="mobile-demo" class="sidenav-trigger"><i class="material-icons">menu</i></a>
        <ul id="main-menu" class="right hide-on-med-and-down">
          <li><a href="/blogs">Blogs</a></li>
          <li><a href="/resources">Resources</a></li>
          <li><a href="/contribute">Contribute</a></li>
          <li><a href="/contact">Contact</a></li>
         <!-- <li><a href="/register">Register</a></li>
          <li><a href="/login">Login</a></li> -->
        </ul>
      </div>
    </nav>
  
    <ul class="sidenav" id="mobile-demo" style="background-color: #2c7873;">
      <br />
      <li><a href="/blogs" style=" color: white;">Blogs</a></li>
      <li><a href="/resources" style=" color: white;">Resources</a></li>
      <li><a href="/contribute" style=" color: white;">Contribute</a></li>
      <li><a href="/contact" style=" color: white;">Contact</a></li>
      <!-- <li><a href="/register" style=" color: white;">Register</a></li>
      <li><a href="/login" style=" color: white;">Login</a></li> -->
    </ul>
          <div id="wave" style="margin-top: 50px;">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 320"><path fill="#2c7873" fill-opacity="1" d="M0,288L60,256C120,224,240,160,360,144C480,128,600,160,720,181.3C840,203,960,213,1080,218.7C1200,224,1320,224,1380,224L1440,224L1440,0L1380,0C1320,0,1200,0,1080,0C960,0,840,0,720,0C600,0,480,0,360,0C240,0,120,0,60,0L0,0Z"></path></svg>
          </div>
              <h2 style="margin-top:-15px;margin-bottom:0px;text-align: center;color: black;">User Contributions</h2>
              <h2 style="margin-top: 15px;margin-bottom:0px;text-align: center;color: orangered;">First Year</h2>
              <h3 style="margin-top:45px;margin-left:6%;color:#64958f">Books</h3>
          <div class="booksGrid">
          `;
  let footer = `
          </div>
          
  <!-- Floating button -->

  <div class="fixed-action-btn" id="myFl">
    <a class="btn-floating btn-large black myFloatingBtn">
      <img src="public/images/logo.png" alt="" style="width: 60px;margin: 10px -1px;filter: invert();" />
    </a>
    <ul>
      <li><a href="/contact#team" class="btn-floating green myFloat">Team</a>
      </li>
      <li><a href="http://jsswire.herokuapp.com" class="btn-floating red myFloat">
        
        <img src="public/images/share.png" alt="" style="width: 30px;margin: 6px -1px;filter: invert();" />
      </a>
      </li>

      <li style="margin: 12px 0px;">

        <a class="btn-floating btn-large black" id="brightness">
          <i class="fa fa-moon-o" style="color: white;"></i>
        </a>

      </li>

    </ul>
  </div>

 <!-- Footer -->

  <!-- <footer class="page-footer" style="background-color: #1a1a1a;margin-top:36px;"> -->
  <footer class="page-footer" style="background-color: #323232;margin-top:36px;">
    <div class="container">
      <div class="row">
        <div style="text-align: center;margin: 75px 0;">
          <h2>Let’s stay connected.</h2>
          <form action="/newsletter" method="POST" style="margin: 30px 0px;">
            <input type="email" name="email" required placeholder="Enter your Email"
              style="width:40%;margin-right: 20px;color: white;" required>
            <button id="newsBtn" type="submit">Subscribe</button>
          </form>
          <p>Sign up to receive our newsletter and exclusive updates.</p>
          <div style="margin-top: 45px;">
            <a href="https://www.facebook.com/JssAcademyOfTechnicalEducationnoida/" class="socials"
              style="color: #1b6ca8;"><i class="fa fa-facebook-official"></i></a>
            <a href="https://twitter.com/jssatenoida?lang=en" class="socials" style="color: #3282b8;"><i
                class="fa fa-twitter-square"></i></a>
          </div>
        </div>
        <hr>
        <div class="col l3 offset-l1 s6">
          <h5 class="white-text">Quick Links</h5>
          <ul>
            <li><a class="grey-text text-lighten-3" href="/blogs">Blogs</a></li>
            <li><a class="grey-text text-lighten-3" href="/resources">Ebooks</a></li>
            <li><a class="grey-text text-lighten-3" href="/usercontributions">User Contributions</a></li>
            <li><a class="grey-text text-lighten-3" href="http://jsswire.herokuapp.com">Connect with wire</a></li>
            <li><a class="grey-text text-lighten-3" href="/contribute">Contribute</a></li>
          </ul>
        </div>
        <div class="col l3 offset-l1 s6">
          <h5 class="white-text">Recent Blogs</h5>
          <ul>
            <li><a class="grey-text text-lighten-3" href="/blogs">What to do when entering a college?</a></li>
            <li><a class="grey-text text-lighten-3" href="/blogs">What I Learned My Freshman Year of College</a></li>
            <li><a class="grey-text text-lighten-3" href="/blogs">A glimpse into Async JavaScript</a></li>
          </ul>
        </div>
        <div class="col l3 offset-l1 s6">
          <h5 class="white-text">Contact</h5>
          <ul>
            <li><a class="grey-text text-lighten-3" href="/contact">Contact Us</a></li>
            <li><a class="grey-text text-lighten-3" href="/contact#team">Our Team</a></li>
            <li><a class="grey-text text-lighten-3" href="/feedback">Feedback</a></li>
          </ul>
        </div>

      </div>
    </div>
    <div class="footer-copyright">
      <div class="container">
        <span>© &nbsp; jssconnect.herokuapp.com &nbsp; 2020</span>
        <span style="margin-left: 20%;">JSSconnnect</span>
        <a class="grey-text text-lighten-4 right" href="/privacy">Privacy Policy</a>
      </div>
    </div>
  </footer>
      
      
        <script>
          // JS for floating buuton
      
          document.addEventListener('DOMContentLoaded', function () {
            let elems = document.querySelectorAll('.fixed-action-btn');
            let instances = M.FloatingActionButton.init(elems);
          });
      
          document.addEventListener('DOMContentLoaded', function () {
            let elems = document.querySelectorAll('.sidenav');
            let instances = M.Sidenav.init(elems);
          });
       const brightness = document.getElementById('brightness');
    const foot = document.querySelector("footer");
    const navbar = document.querySelector("nav"); 
  const sidenav = document.querySelector('.sidenav');
    let count = 0;
    brightness.addEventListener("click", () => {

      if (count < 1) {
        count = 1;
        localStorage.setItem("theme", "dark");
        
      }
      else if (count == 1) {
        count = 0;
        localStorage.setItem("theme", "light");
      }
      setTheme();
    })


    function setTheme() {

      const currentTheme = localStorage.getItem("theme");
      if (currentTheme == "dark") {
        foot.style.backgroundColor = "#1b262c"
        navbar.style.backgroundColor = "#1b262c";
        brightness.innerHTML = "<i class='fa fa-sun-o' style='color: goldenrod;'></i>"
        sidenav.style.backgroundColor = "#1b262c";
      }
      else {
        foot.style.backgroundColor = "#323232"
        navbar.style.backgroundColor = "#2c7873";
        sidenav.style.backgroundColor = "#2c7873";
        brightness.innerHTML = "<i class='fa fa-moon-o' style='color: white;'></i>"
      }
    }
      
        </script>
      
      
      </body>
      
      </html>`;

  const department = req.body.department;
  const subject = req.body.subject;

  let books1 = "";
  ufirstyearBook.find({ subject: subject }, function (err, found) {
    if (err) {
      console.log(err)
    } else {
      for (let i = 0; i < found.length; i++) {
        console.log(found[i]);
        books1 += `
                   <a href="${found[i].link}" class="resLink">
                   <div class="Bthree">
                  <div class="Btwo">
                  <p style="font-weight:bold;font-size:1.2rem;padding-top:20px;color:white;">${found[i].resname}</p>
                  <div class="Bone">
                  <p style="margin:0;color:#204051;font-weight: 500;padding:0 2px;">${found[i].authorName}</p>
                  </div>
                  </div>
                  </div>
                  </a>  
          `;

      }
    }

  })
  let notes1 = "";
  ufirstyearNote.find({ subject: subject }, function (err, found) {
    if (err) {
      console.log(err)
    } else {

      for (let i = 0; i < found.length; i++) {
        notes1 += `
        <a href="${found[i].link}" class="resLink">
        <div class="Bthree" style="border-color:#596157;">
        <div class="Btwo" style="background-color:#5b8c5a">
       <p style="font-weight:bold;font-size:1.2rem;padding-top:20px;color:white;">${found[i].resname}</p>
       <div class="Bone">
       <p style="margin:0;color:#5b8c5a;font-weight: 500;padding:0 2px;">${found[i].authorName}</p>
       </div>
       </div>
       </div>
       </a>  
               `;

      }

    }

  let total = navbar + books1 + "</div> <h3 style='margin-top:60px;margin-bottom:0;margin-left:6%;color:#81b214;'>Notes</h3><div class='booksGrid'>" + notes1  + footer;
  res.write(total);
  res.send();
})
})

// SecondYear Resources
app.post("/usecondyear", (req, res) => {

  let navbar = `<!DOCTYPE html>
        <html lang="en">
        
        <head>
          <meta charset="UTF-8" />
          <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        
        
          <!-- Compiled and minified CSS -->
          <link href="https://fonts.googleapis.com/icon?family=Material+Icons" rel="stylesheet" />
          <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/materialize/1.0.0/css/materialize.min.css" />
        
          <!-- Compiled and minified JavaScript -->
          <script src="https://cdnjs.cloudflare.com/ajax/libs/materialize/1.0.0/js/materialize.min.js"></script>
        
        
          <!--Google fonts-->
          <link href="https://fonts.googleapis.com/css2?family=Cairo&display=swap" rel="stylesheet">
          <link rel="stylesheet" href="/index.css" />
          <!--Font Awesome-->
          <script src="https://kit.fontawesome.com/efd71d3ed7.js" crossorigin="anonymous"></script>

          <link rel="icon" href="https://www.freelogoservices.com/api/main/images/1j+ojFVDOMkX9Wytexe43D6kifODqxBHnRbIwXs1M3EMoAJtlSkkjvBt9Ps+" width="10" height="10" type="image/x-icon">
          <title>JSS Connect</title>
          <style>
              .booksBox,.notesBox{
                  border: 4px solid gray;
                  border-radius: 4px;
                  border-bottom-right-radius:35px;
                  box-shadow:4px 8px 2px 1px gray;
                  border-bottom-width:5px;
                  border-bottom-color: #006a71;
                  background:linear-gradient(to bottom left,#006a71,#e4e3e3);
                  margin:20px;
                  margin-left:50px;
                  width:200px;
                  height:200px;
                  padding:12px;
                  color:white;
                  text-align:center;
                }
              .notesBox{
                
                background: rgb(2,0,36);
                background: linear-gradient(90deg, rgba(2,0,36,1) 0%, rgba(9,121,105,1) 34%, rgba(0,212,255,1) 100%);
              }
              .booksGrid{
                  margin-top:40px;
                  padding: 0 60px;
                  display:grid;
                  grid-template-columns: repeat(4,1fr);
              }


        
.Bthree{
    width:200px;
    height:240px;
    box-shadow: 0px 0px 10px 0px black;
    border-left:10px solid #3b6978;
    margin:15px;
    margin-top: 40px;
    border-top-right-radius: 4px;
    border-bottom-right-radius: 4px;
}

.Btwo{
    width:160px;
    height:190px;
    background-color:#204051;
    text-align:center;
    position: relative;
    border-top-right-radius: 4px;
    border-bottom-right-radius: 4px;
}
.Bone{
    width:135px;
    border: 3px solid white;
    position: absolute;
    bottom: 25px;
    left: 12px;
    border-radius: 6px;
    font-size:15px;
    background-color:white;
}

.Bthree:hover{
    transform: rotate(-6deg);
    transition: 0.3s;
}
.resLink{
  width:fit-content;
  height:fit-content;
}

@media screen and (max-width:1000px){
  .booksGrid{
    padding: 0 10%;
    grid-template-columns: repeat(2,1fr);
}
}
@media screen and (max-width:540px){
  .booksGrid{
    padding: 0 10%;
    grid-template-columns: repeat(1,1fr);
}
}

.myFloatingBtn:hover {
	transform: rotate(360deg);
	transition: 0.7s linear all;
}
          </style>
        </head>
        
        <body>
        <nav id="navbar" style="background-color: #2c7873;font-family: 'Cairo', sans-serif;">
        <div class="nav-wrapper">
        <a href="/" class="brand-logo"><img src="https://www.freelogoservices.com/api/main/images/1j+ojFVDOMkX9Wytexe43D6kifODqxBHnRbIwXs1M3EMoAJtlSkkjvBt9Ps+" alt="" style="width: 75px;margin-top: 7px;filter: invert();" /></a>
        <a href="/" class="brand-logo" id="logoText" style="margin-left: 75px; font-size: 2rem">JSS Connect</a>
        <a href="#" data-target="mobile-demo" class="sidenav-trigger"><i class="material-icons">menu</i></a>
        <ul id="main-menu" class="right hide-on-med-and-down">
          <li><a href="/blogs">Blogs</a></li>
          <li><a href="/resources">Resources</a></li>
          <li><a href="/contribute">Contribute</a></li>
          <li><a href="/contact">Contact</a></li>
          <!-- <li><a href="/register">Register</a></li>
          <li><a href="/login">Login</a></li> -->
        </ul>
      </div>
    </nav>
  
    <ul class="sidenav" id="mobile-demo" style="background-color: #2c7873;">
      <br />
      <li><a href="/blogs" style=" color: white;">Blogs</a></li>
      <li><a href="/resources" style=" color: white;">Resources</a></li>
      <li><a href="/contribute" style=" color: white;">Contribute</a></li>
      <li><a href="/contact" style=" color: white;">Contact</a></li>
      <!-- <li><a href="/register">Register</a></li>
      <li><a href="/login">Login</a></li> -->
    </ul>
      <div id="wave" style="margin-top: 50px;">
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 320"><path fill="#2c7873" fill-opacity="1" d="M0,288L60,256C120,224,240,160,360,144C480,128,600,160,720,181.3C840,203,960,213,1080,218.7C1200,224,1320,224,1380,224L1440,224L1440,0L1380,0C1320,0,1200,0,1080,0C960,0,840,0,720,0C600,0,480,0,360,0C240,0,120,0,60,0L0,0Z"></path></svg>
      </div>
          <h2 style="margin-top:-15px;margin-bottom:0px;text-align: center;color: black;">User Contributions</h2>
          <h2 style="margin-top: 15px;margin-bottom:0px;text-align: center;color: orangered;">Second Year</h2>
          <h3 style="margin-top:45px;margin-left:6%;color:#64958f">Books</h3>
          <div class="booksGrid">
          `;
  let footer = `
            </div>
          
  <!-- Floating button -->

  <div class="fixed-action-btn" id="myFl">
    <a class="btn-floating btn-large black myFloatingBtn">
      <img src="public/images/logo.png" alt="" style="width: 60px;margin: 10px -1px;filter: invert();" />
    </a>
    <ul>
      <li><a href="/contact#team" class="btn-floating green myFloat">Team</a>
      </li>
      <li><a href="http://jsswire.herokuapp.com" class="btn-floating red myFloat">
        
        <img src="public/images/share.png" alt="" style="width: 30px;margin: 6px -1px;filter: invert();" />
      </a>
      </li>

      <li style="margin: 12px 0px;">

        <a class="btn-floating btn-large black" id="brightness">
          <i class="fa fa-moon-o" style="color: white;"></i>
        </a>

      </li>

    </ul>
  </div>

 <!-- Footer -->

  <!-- <footer class="page-footer" style="background-color: #1a1a1a;margin-top:36px;"> -->
  <footer class="page-footer" style="background-color: #323232;margin-top:36px;">
    <div class="container">
      <div class="row">
        <div style="text-align: center;margin: 75px 0;">
          <h2>Let’s stay connected.</h2>
          <form action="/newsletter" method="POST" style="margin: 30px 0px;">
            <input type="email" name="email" required placeholder="Enter your Email"
              style="width:40%;margin-right: 20px;color: white;" required>
            <button id="newsBtn" type="submit">Subscribe</button>
          </form>
          <p>Sign up to receive our newsletter and exclusive updates.</p>
          <div style="margin-top: 45px;">
            <a href="https://www.facebook.com/JssAcademyOfTechnicalEducationnoida/" class="socials"
              style="color: #1b6ca8;"><i class="fa fa-facebook-official"></i></a>
            <a href="https://twitter.com/jssatenoida?lang=en" class="socials" style="color: #3282b8;"><i
                class="fa fa-twitter-square"></i></a>
          </div>
        </div>
        <hr>
        <div class="col l3 offset-l1 s6">
          <h5 class="white-text">Quick Links</h5>
          <ul>
            <li><a class="grey-text text-lighten-3" href="/blogs">Blogs</a></li>
            <li><a class="grey-text text-lighten-3" href="/resources">Ebooks</a></li>
            <li><a class="grey-text text-lighten-3" href="/usercontributions">User Contributions</a></li>
            <li><a class="grey-text text-lighten-3" href="http://jsswire.herokuapp.com">Connect with wire</a></li>
            <li><a class="grey-text text-lighten-3" href="/contribute">Contribute</a></li>
          </ul>
        </div>
        <div class="col l3 offset-l1 s6">
          <h5 class="white-text">Recent Blogs</h5>
          <ul>
            <li><a class="grey-text text-lighten-3" href="/blogs">What to do when entering a college?</a></li>
            <li><a class="grey-text text-lighten-3" href="/blogs">What I Learned My Freshman Year of College</a></li>
            <li><a class="grey-text text-lighten-3" href="/blogs">A glimpse into Async JavaScript</a></li>
          </ul>
        </div>
        <div class="col l3 offset-l1 s6">
          <h5 class="white-text">Contact</h5>
          <ul>
            <li><a class="grey-text text-lighten-3" href="/contact">Contact Us</a></li>
            <li><a class="grey-text text-lighten-3" href="/contact#team">Our Team</a></li>
            <li><a class="grey-text text-lighten-3" href="/feedback">Feedback</a></li>
          </ul>
        </div>

      </div>
    </div>
    <div class="footer-copyright">
      <div class="container">
        <span>© &nbsp; jssconnect.herokuapp.com &nbsp; 2020</span>
        <span style="margin-left: 20%;">JSSconnnect</span>
        <a class="grey-text text-lighten-4 right" href="/privacy">Privacy Policy</a>
      </div>
    </div>
  </footer>

      
      
        <script>
          // JS for floating buuton
      
          document.addEventListener('DOMContentLoaded', function () {
            let elems = document.querySelectorAll('.fixed-action-btn');
            let instances = M.FloatingActionButton.init(elems);
          });
      
          document.addEventListener('DOMContentLoaded', function () {
            let elems = document.querySelectorAll('.sidenav');
            let instances = M.Sidenav.init(elems);
          });
      
           const brightness = document.getElementById('brightness');
    const foot = document.querySelector("footer");
    const navbar = document.querySelector("nav"); 
  const sidenav = document.querySelector('.sidenav');
    let count = 0;
    brightness.addEventListener("click", () => {

      if (count < 1) {
        count = 1;
        localStorage.setItem("theme", "dark");
        
      }
      else if (count == 1) {
        count = 0;
        localStorage.setItem("theme", "light");
      }
      setTheme();
    })


    function setTheme() {

      const currentTheme = localStorage.getItem("theme");
      if (currentTheme == "dark") {
        foot.style.backgroundColor = "#1b262c"
        navbar.style.backgroundColor = "#1b262c";
        brightness.innerHTML = "<i class='fa fa-sun-o' style='color: goldenrod;'></i>"
        sidenav.style.backgroundColor = "#1b262c";
      }
      else {
        foot.style.backgroundColor = "#323232"
        navbar.style.backgroundColor = "#2c7873";
        sidenav.style.backgroundColor = "#2c7873";
        brightness.innerHTML = "<i class='fa fa-moon-o' style='color: white;'></i>"
      }
    }
      
        </script>
      
      
      </body>
      
      </html>`;

  const department = req.body.department;
  const subject = req.body.subject;

  let books1 = "";
  usecondyearBook.find({ department: department, subject: subject }, function (err, found) {
    if (err) {
      console.log(err)
    } else {

      for (let i = 0; i < found.length; i++) {
        books1 += `
                       
                   <a href="${found[i].link}" class="resLink">
                   <div class="Bthree">
                  <div class="Btwo">
                   <p style="font-weight:bold;font-size:1.2rem;padding-top:20px;color:white;">${found[i].resname}</p>
                  <div class="Bone">
                  <p style="margin:0;color:#204051;font-weight: 500;padding:0 2px;">${found[i].authorName}</p>
                  </div>
                  </div>
                  </div>
                  </a>  
          `;

      }
    }

  })
  let notes1 = "";
  secondyearNote.find({ subject: subject }, function (err, found) {
    if (err) {
      console.log(err)
    } else {

      for (let i = 0; i < found.length; i++) {
        notes1 += `
        <a href="${found[i].link}" class="resLink">
        <div class="Bthree" style="border-color:#596157;">
        <div class="Btwo" style="background-color:#5b8c5a">
       <p style="font-weight:bold;font-size:1.2rem;padding-top:20px;color:white;">${found[i].resname}</p>
       <div class="Bone">
       <p style="margin:0;color:#5b8c5a;font-weight: 500;padding:0 2px;">${found[i].authorName}</p>
       </div>
       </div>
       </div>
       </a>  
               `;

      }

    }
    
    let total = navbar + books1 + "</div> <h3 style='margin-top:60px;margin-bottom:0;margin-left:6%;color:#81b214;'>Notes</h3><div class='booksGrid'>" + notes1 + footer;
    res.write(total);
    res.send();
  })
})











app.listen(port, () => {
  console.log(`Server running at  http://${hostname}:${port}/`);
});



