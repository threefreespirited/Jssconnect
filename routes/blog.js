const router = require("express").Router();
const { blogs,blogData,myBlog,getUserBlog,saveBlog} = require("../controller/blogController")

// get all blogs
router.route("/").get(blogs);
router.route("/blog").post(myBlog);
router.route("/userblog").get(getUserBlog);
router.route("/getdata").get(blogData);

// to save blog
router.route("/").post(saveBlog);
 
module.exports = router;

 