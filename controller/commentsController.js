const userComment = require('../models/commentsModel')

 
const saveComment = async (req, res) => {
  console.log("post happend");
  console.log(req.body);

  if (req.isAuthenticated()) {
    console.log("U'r Signed Succesffully");
    console.log(req.user);
    let myuserComment = new userComment(req.body);
    myuserComment.save();
    res.send("Your Comment Save");
  } else {
    console.log("Not Signed In");
    res.send("Please Sign In First");
  }
}


// app.get("/getComment/:id", (req, res) => {
//   console.log("get request made");
//   console.log(req.params.id);
//   userComment.find({uniqueId: req.params.id}, (err, data) => {
//     if (err) console.log(err);
//     else {
 
//       console.log("00000000000000000000000");
//       console.log(data);
//       res.send(data);
//     }
//   })
// })
const getComment  = async(req, res) => {
  console.log("get request made");
  console.log(req.params.id);
  userComment.find({uniqueId: req.params.id}, (err, data) => {
    if (err) console.log(err);
    else {
 
      console.log("00000000000000000000000");
      console.log(data);
      res.send(data);
    }
  })
}


module.exports = {saveComment, getComment}
// find all comments
