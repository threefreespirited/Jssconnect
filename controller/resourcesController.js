// RESOURCE PAGE

const getAllResources = async (req, res) => {
  let username = "Guest";
  let cssName = "css/resource.css";
  let pageTitle = "JSS Connect|Resources";
  let picture =
    "https://cdn2.iconfinder.com/data/icons/ios-7-icons/50/user_male2-512.png";
  let email = "";
  if (req.isAuthenticated()) {
    username = req.user.name;
    picture = req.user.picture;
    email = req.user.email;
  }
  res.render("resources", {
    username,
    picture,
    email,
    pageTitle: pageTitle,
    cssName: cssName,
  });
}; 


module.exports = getAllResources