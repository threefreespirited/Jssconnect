const userBlog = require("../models/blogModel")

const blogs = async (req, res) => {
    let pageTitle = "Blogs | Jssconnect";
    let cssName = "css/blogs.css";
    let username = "Guest";
    let picture = "https://cdn2.iconfinder.com/data/icons/ios-7-icons/50/user_male2-512.png";
    let email = "";
    if (req.isAuthenticated()) {
      username = req.user.name;
      picture = req.user.picture;
      email = req.user.email;
    }
  
    userBlog.find({}, (err, data) => {
      if (err) console.log(err);
      else {
        console.log(data[2].imageurl);
        res.render("blogs", {
          data: data,
          pageTitle,
          cssName: cssName,
          username,
          picture,
          email
        });
      }
    });
}

const saveBlog = async (req, res) => {
   
  let myuserBlog = new userBlog(req.body);
  myuserBlog.save();

  res.writeHead(200, {
    "Content-Type": "text/html",
  });
  let myResponse = `<img src='https://img2.pngio.com/writing-services-png-picture-889262-writing-services-png-web-content-png-650_519.png' style='margin:60px 42%; width:200px;'><p style='text-align:center;font-size:1.8rem;margin-top:20px;'>Thanks for adding one!<br>We hope your blog is worthy enough to be displayed on our dashboard.<br><br>Our team will look onto it as soon as possible..</p><a href='/'style='text-align:center;margin-left:42.5%;'><button style='font-size:1.3rem;padding:9px;border-radius:10px;border:2px solid #30475e;background-color:#d6e0f0;color:#30475e;cursor:pointer;'>Back to Jssconnect</button></a>`;
  res.write(myResponse);
  res.send();
}
  
 


const blogData = async(req,res)=>{
    console.log("get rquest made to blog section");
    userBlog.find({}, (err, data) => {
      if (err) console.log(err);
      else {
        console.log("blogdata" + data);
        res.send(data);
      }
    })
}



 

const getUserBlog = async (req, res)=>{
       let pageTitle = "Your Blog";
    let cssName = "css/blogs.css";
  
    if (req.isAuthenticated()) {
      let username = req.user.name;
      let picture = req.user.picture;
      email = req.user.email;
      res.render("userblog", {
        pageTitle,
        cssName,
        username,
        picture,
        email
      });
    } else {
      res.redirect("/login");
    }
  }
  
 const myBlog = async (req, res) => {
   console.log(req.body.uniqueId);
   let uniId = req.body.uniqueId;
   let pageTitle = "Blog | Jssconnect";
   let cssName = "css/blogs.css";
   let username = "Guest";
   let like = 0;
   let uniqueId = uniId;
   let picture =
     "https://cdn2.iconfinder.com/data/icons/ios-7-icons/50/user_male2-512.png";
   let email = "";
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
       res.render("blog", {
         blogData: data[uniId],
         username,
         picture,
         email,
         pageTitle,
         cssName,
         uniqueId,
       });
     }
   });
 };

 
module.exports = { blogs, blogData, getUserBlog , myBlog, saveBlog }

