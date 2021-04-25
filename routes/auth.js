const router = require("express").Router();
const auth = require("../middelware/auth");
const { getUser, logIn } = require("../controll/auth");

// Method GET
// Route For Get User
router.get("/", auth, getUser);

// Method POST
// Route For Log In
router.post("/login", logIn);

module.exports = router;
