const login = async (req, res) => {
  let pageTitle = "JSS Connect | Login";
  let cssName = "css/login.css";
  let username = "Guest";
  let picture =
    "https://cdn2.iconfinder.com/data/icons/ios-7-icons/50/user_male2-512.png";
  let email = "";
  let message = "";
  if (req.query.message != "") {
    message = req.query.message;
  }
  if (req.isAuthenticated()) {
    username = req.user.name;
    picture = req.user.picture;
    email = req.user.email;
  }
  res.render("login", {
    pageTitle: pageTitle,
    cssName: cssName,
    username,
    picture,
    email,
    message,
  });
};

const logout = async (req, res) => {

  req.logOut();
  res.redirect("/");
};
 

 
module.exports = {login, logout};
