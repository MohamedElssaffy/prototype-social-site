const { check, validationResult } = require("express-validator");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const config = require("config");
const User = require("../models/User");

// Method GET
// Route For Get User
const getUser = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");

    if (!user) {
      return res.status(500).send("Server Error");
    }
    res.json({ user });
  } catch (e) {
    console.error(e);
    res.status(500).send("Server Error");
  }
};

const logIn = [
  [
    check("email", "Please Enter An Email").isEmail(),
    check("password", "You Should enter your password"),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    try {
      const { email, password } = req.body;
      const user = await User.findOne({ email });

      if (!user) {
        return res
          .status(400)
          .json({ errors: [{ msg: "Your Email Or Password is Wrong" }] });
      }

      const isMatchPassword = await bcrypt.compare(password, user.password);

      if (!isMatchPassword) {
        return res
          .status(400)
          .json({ errors: [{ msg: "Your Email Or Password is Wrong" }] });
      }

      const payload = {
        user: { id: user.id },
      };

      const token = jwt.sign(payload, config.get("JWT_SECRET"));

      res.json({ token });
    } catch (e) {
      console.error(e);
      res.status(500).send("Server Error");
    }
  },
];

module.exports = { logIn, getUser };
