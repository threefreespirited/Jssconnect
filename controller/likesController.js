const userLikes = require('../models/likesModel')
 
const saveLikes = async (req, res) => {
   console.log(req.body, "likes");

   if (req.isAuthenticated()) {
     var myLikes = [];

     userLikes.find({ uniqueId: req.body.uniqueId }, async (err, data) => {
       if (err) console.log(err);
       else if (data == "") {
         console.log("data empty");
         myLikes.push(req.body.email);
         let newuserlikes = new userLikes({
           uniqueId: req.body.uniqueId,
           likes: myLikes,
         });
         newuserlikes.save();
         res.json(JSON.stringify({ likedearlier: true }));
       } else if (data != "") {
         myLikes = await data[0].likes;
         console.log(myLikes, "data[0].likes");

         // check if user already liked the post
         let likecheck = 0;
         for (let i = 0; i < myLikes.length; i++) {
           if (myLikes[i] == req.body.email) {
             likecheck = 1;
             break;
           }
         }
         if (likecheck == 1) {
           res.json(JSON.stringify({ likedearlier: true }));
         } else if (likecheck == 0) {
           myLikes.push(req.body.email);
           console.log(myLikes, "data[0].likes");
           // update original entry(if exists)
           userLikes.updateOne(
             { uniqueId: req.body.uniqueId },
             { likes: myLikes },
             function (err, result) {
               if (err) {
                 console.log(err);
               } else {
                 console.log("Result :", result);
               }
             }
           );
           res.json(JSON.stringify({ likedearlier: false }));
         }
       }
     });
   } else {
     res.send("not authenticated");
   }
}

 
const getLikes = async(req, res) => {
  console.log(req.query.uniqueId, "req.query.uniqueId");
  let myLikes = [];
  userLikes.find({ uniqueId: req.query.uniqueId }, async (err, likedata) => {
    if (err) console.log(err);
    else if (likedata) {
      myLikes = JSON.stringify(await likedata[0].likes);
      res.json(myLikes);
    }
  });
} 


module.exports = {getLikes, saveLikes}