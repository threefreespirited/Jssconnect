const router = require("express").Router();
const getAllResources = require("../controller/resourcesController");
const { findFirstYear, findUserFirstYear }  = require("../controller/firstyearController")
const {
  findSecondYear,
  findUserSecondYear 
} = require("../controller/secondyearController");

router.route("/").get(getAllResources);
router.route("/firstyear").post(findFirstYear);
router.route("/ufirstyear").post(findUserFirstYear);
router.route("/secondyear").post(findSecondYear);
router.route("/usecondyear").post(findUserSecondYear);


module.exports = router; 
