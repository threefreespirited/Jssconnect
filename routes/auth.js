const router = require("express").Router();
const {login, logout} = require("../controller/userController");



// Login Page
router.route("/login").get(login);
router.route("/logout").get(logout);

module.exports = router;