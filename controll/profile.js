const axios = require("axios");
const config = require("config");
const { check, validationResult } = require("express-validator");
const Profile = require("../models/Profile");
const User = require("../models/User");

const getMyProfile = async (req, res) => {
  try {
    const profile = await Profile.findOne({
      user: req.user.id,
    }).populate("user", ["name", "avatar"]);

    if (!profile) {
      return res.status(400).json({ msg: "This User Dont Have Profile" });
    }

    res.json(profile);
  } catch (e) {
    console.error(e);
    res.status(500).send("Sever Error");
  }
};

const createProfile = [
  [
    check("status", "Status is Required").notEmpty(),
    check("skills", "Skills Is Required").notEmpty(),
  ],
  async (req, res) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const {
      company,
      website,
      location,
      bio,
      status,
      skills,
      youtube,
      facebook,
      twitter,
      instgram,
      linkedin,
      githubusername,
    } = req.body;

    try {
      const profileFields = {};
      profileFields.user = req.user.id;
      profileFields.status = status;

      if (company) profileFields.company = company;

      if (location) profileFields.location = location;

      if (website) profileFields.website = website;

      if (bio) profileFields.bio = bio;

      if (githubusername) profileFields.githubusername = githubusername;

      if (skills) {
        profileFields.skills = skills.split(",").map((skill) => skill.trim());
      }

      //  Build Social Object
      profileFields.social = {};

      if (facebook) profileFields.social.facebook = facebook;
      if (twitter) profileFields.social.twitter = twitter;
      if (linkedin) profileFields.social.linkedin = linkedin;
      if (youtube) profileFields.social.youtube = youtube;
      if (instgram) profileFields.social.instgram = instgram;

      let profile = await Profile.findOne({ user: req.user.id });
      if (profile) {
        // Update It
        profile = await Profile.findOneAndUpdate(
          { user: req.user.id },
          { $set: profileFields },
          { new: true }
        );
        return res.json(profile);
      }

      profile = new Profile({ ...profileFields });

      await profile.save();
      res.status(201).json(profile);
    } catch (e) {
      console.error(e);
      res.status(500).send("Sever Error");
    }
  },
];

const getUsersProfile = async (req, res) => {
  try {
    const profiles = await Profile.find().populate("user", ["name", "avatar"]);

    if (!profiles) {
      return res.json({ msg: "We Dont Have Users" });
    }

    res.json(profiles);
  } catch (e) {
    console.error(e);
    res.status(500).send("Sever Error");
  }
};

const getProfile = async (req, res) => {
  try {
    const profile = await Profile.findOne({
      user: req.params.user_id,
    }).populate("user", ["name", "avatar"]);

    if (!profile) {
      return res.status(400).json({ msg: "This User Dont Have Profile" });
    }

    res.json(profile);
  } catch (e) {
    console.error(e);

    if (e.kind === "ObjectId") {
      return res.status(400).json({ msg: "This User Dont Have Profile" });
    }
    res.status(500).send("Sever Error");
  }
};

const deleteProfile = async (req, res) => {
  try {
    //  Remove Posts
    //  Remove Profile
    await Profile.findOneAndRemove({ user: req.user.id });

    //  Remove User
    await User.findByIdAndRemove(req.user.id);

    res.json({ msg: "User Deleted" });
  } catch (e) {
    console.error(e);
    res.status(500).send("Sever Error");
  }
};

const addExperience = [
  [
    check("title", "Title Is Required").notEmpty(),
    check("company", "Company Is Required").notEmpty(),
    check("from", "From Is Required").notEmpty(),
  ],
  async (req, res) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const {
      company,
      title,
      location,
      from,
      to,
      current,
      description,
    } = req.body;

    const newExp = { company, title, location, from, to, current, description };

    try {
      const profile = await Profile.findOne({ user: req.user.id });

      if (!profile) {
        return res.status(400).json({ msg: "You Dont Have Profile" });
      }

      const indexOfCompanyIfItExist = profile.experience.findIndex(
        (experience) =>
          experience.company.toLowerCase() === company.toLowerCase()
      );

      if (indexOfCompanyIfItExist > -1) {
        profile.experience[indexOfCompanyIfItExist] = newExp;
      } else {
        profile.experience.unshift(newExp);
      }

      await profile.save();
      res.json(profile);
    } catch (e) {
      console.error(e);
      res.status(500).send("Server Error");
    }
  },
];

const deleteExperience = async (req, res) => {
  try {
    const profile = await Profile.findOne({ user: req.user.id });

    if (!profile) {
      return res.status(400).json({ msg: "You Dont Have Profile" });
    }

    const indexToRemove = profile.experience.findIndex(
      (experience) => experience.id === req.params.exp_id
    );

    if (indexToRemove > -1) {
      profile.experience.splice(indexToRemove, 1);

      await profile.save();

      res.json(profile);
    } else {
      res.status(400).json({ msg: "Cant Find This Experience" });
    }
  } catch (e) {
    console.error(e);

    res.status(500).send("Server Error");
  }
};

const addEducation = [
  [
    check("school", "School Is Required").notEmpty(),
    check("degree", "Degree Is Required").notEmpty(),
    check("from", "From Is Required").notEmpty(),
    check("fieldofstudy", "fieldofstudy Is Required").notEmpty(),
  ],
  async (req, res) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const {
      school,
      degree,
      fieldofstudy,
      from,
      to,
      current,
      description,
    } = req.body;

    const newEdu = {
      school,
      degree,
      fieldofstudy,
      from,
      to,
      current,
      description,
    };

    try {
      const profile = await Profile.findOne({ user: req.user.id });

      if (!profile) {
        return res.status(400).json({ msg: "You Dont Have Profile" });
      }

      const indexOfSchoolIfItExist = profile.education.findIndex(
        (education) => education.school.toLowerCase() === school.toLowerCase()
      );

      if (indexOfSchoolIfItExist > -1) {
        profile.education[indexOfSchoolIfItExist] = newEdu;
      } else {
        profile.education.unshift(newEdu);
      }

      await profile.save();
      res.json(profile);
    } catch (e) {
      console.error(e);
      res.status(500).send("Server Error");
    }
  },
];

const deleteEducation = async (req, res) => {
  try {
    const profile = await Profile.findOne({ user: req.user.id });

    if (!profile) {
      return res.status(400).json({ msg: "You Dont Have Profile" });
    }

    const indexToRemove = profile.education.findIndex(
      (education) => education.id === req.params.edu_id
    );

    if (indexToRemove > -1) {
      profile.education.splice(indexToRemove, 1);

      await profile.save();

      res.json(profile);
    } else {
      res.status(400).json({ msg: "Cant Find This Education" });
    }
  } catch (e) {
    console.error(e);

    res.status(500).send("Server Error");
  }
};

const gitHub = async (req, res) => {
  try {
    const uri = encodeURI(
      `https://api.github.com/users/${req.params.username}/repos?per_page=5&sort=created:asc`
    );

    const headers = {
      "user-agent": `node.js`,
      Authorization: `token ${config.get("acc_token")}`,
    };

    const githubdrequest = await axios(uri, headers);
    res.json(githubdrequest.data);
  } catch (e) {
    console.error(e);
    res.status(404).json({ msg: "No Github profile found" });
  }
};

module.exports = {
  gitHub,
  getMyProfile,
  getUsersProfile,
  getProfile,
  createProfile,
  addEducation,
  addExperience,
  deleteEducation,
  deleteExperience,
  deleteProfile,
};
