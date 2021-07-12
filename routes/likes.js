const router = require("express").Router();
const { getLikes, saveLikes } = require("../controller/likesController");

router.route("/getlikes").get(getLikes);

router.route("/savelikes").post(saveLikes);

module.exports = router;
