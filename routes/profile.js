const router = require("express").Router();
const {
  getMyProfile,
  createProfile,
  getUsersProfile,
  getProfile,
  deleteProfile,
  addExperience,
  deleteExperience,
  addEducation,
  deleteEducation,
  gitHub,
} = require("../controll/profile");
const auth = require("../middelware/auth");

// Method GET
// Route For Get Users Profile
router.get("/me", auth, getMyProfile);

// Method POST
// Route For Create Profile
router.post("/", auth, createProfile);

// Method GET
// Route For Get Users Profile
router.get("/", getUsersProfile);

// Method GET
// Route For Get Users Profile
router.get("/user/:user_id", getProfile);

// Method Delete
// Route For Delete User, Profile & Posts
router.delete("/", auth, deleteProfile);

// Method PUT
//  Route For Add Experience in your profile

router.put("/experience", auth, addExperience);

// Method Delete
// Route For Delete Experience

router.delete("/experience/:exp_id", auth, deleteExperience);

// Method PUT
//  Route For Add Education in your profile

router.put("/education", auth, addEducation);

// Method Delete
// Route For Delete Education

router.delete("/education/:edu_id", auth, deleteEducation);

// Method GET
// Route For Git GitHub Repos By UserName

router.get("/github/:username", gitHub);

module.exports = router;
