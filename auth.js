//jshint esversion:6
const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");

require("dotenv").config();
const session = require("express-session");
const passport = require("passport");
const passportLocalMongoose = require("passport-local-mongoose");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const findOrCreate = require("mongoose-findorcreate");

// for serving static files
app.use('/public', express.static(__dirname+'public'));

 /*  const md5 = require("md5");  */
/* const bcrypt = require("bcrypt");
 const saltRounds = 10;   */
const app = express();
app.use(session ({
    secret: process.env.SECRET,
    resave: false,
    saveUninitialized: false,
}));
app.use(passport.initialize());
app.use(passport.session());
mongoose.connect('mongodb://localhost:27017/newUser', {useNewUrlParser: true, useUnifiedTopology: true});
mongoose.set("useCreateIndex", true);
app.use(express.static("public"));

app.use(bodyParser.urlencoded({extended: true}));
// we need to change schema to encrypt 
const userSchema = new mongoose.Schema ({
    // email: String,
    // password: String,
    name:String,
    googleId : String
});
userSchema.plugin(passportLocalMongoose);
userSchema.plugin(findOrCreate);

  console.log(process.env.SECRET);     
 userSchema.plugin(encrypt, {secret: process.env.SECRET, encryptedFields: ["password"]}); 
// it must be declared above model
const User = mongoose.model("User", userSchema);
passport.use(User.createStrategy());
 
passport.serializeUser(function(user, done) {
    done(null, user.id);
  });
  
  passport.deserializeUser(function(id, done) {
    User.findById(id, function(err, user) {
      done(err, user);
    });
  });
passport.use(new GoogleStrategy({
    clientID: process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET,
    callbackURL: "http://localhost/auth/google/blogs",
    userProfileURL: "https://www.googleapis.com/oauth2/v3/userinfo"
},
function(accessToken, refreshToken, profile, cb) {
    console.log(profile);
    User.findOrCreate({ googleId: profile.id,name:profile.displayName}, function (err, user) {
      return cb(err, user);
    });
  }
));



app.get("/", function(req,res){

    res.render("index");
});
app.get('/auth/google',
  passport.authenticate('google', { scope: ['profile'] })
  );

  app.get('/auth/google/blogs', 
  passport.authenticate('google', { failureRedirect: '/login' }),
 function(req, res) {
    // Successful authentication, redirect home.
    res.redirect('/blogs');
   });

app.get("/login", function(req,res){
    
    res.render("login");
});

app.get("/register", function(req,res){
    
    res.render("register");
});
app.get("/blogs", function(req,res){
    if(req.isAuthenticated()) {
        res.render("blogs");
    }
    else 
    {
        res.redirect("/login");
    }
});
app.get("/logout",function(req,res){
    req.logOut();
    res.redirect("/");
});

app.post("/register", function(req,res) {
   User.register({username: req.body.username},req.body.password, function(err,user){
       if(err){
           console.log(err);
           res.redirect("/register");
       }
       else 
       {
           passport.authenticate("local") (req,res,function(){
               res.redirect("/blogs");
           });
       }
   });
});

app.post("/login", function(req,res) {
    const user = new User({
        username: req.body.username,
        password: req.body.password
    });
 req.login(user,function(err){
     if(err){
         console.log(err);
     }
     else {
         passport.authenticate("local") (req,res,function(){
             res.redirect("/blogs");
         });
     }
 });
});






app.listen(80, function(){
    console.log("server is running on port 3000");
});