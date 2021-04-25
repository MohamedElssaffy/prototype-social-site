const router = require("express").Router();
const { registeredUser } = require("../controll/users");

// Method POST
// Route For Registered
router.post("/register", registeredUser);

module.exports = router;
