const { check, validationResult } = require("express-validator");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const gravatar = require("gravatar");
const config = require("config");
const User = require("../models/User");

// Method POST
// Route For Registered
const registeredUser = [
  [
    check("name", "Name is required ").not().isEmpty().escape().trim(),
    check("email", "PLease enter an email").isEmail(),
    check("password", "Password should be more than 6 characters").isLength({
      min: 6,
    }),
  ],
  async (req, res) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    try {
      const userExist = await User.findOne({ email: req.body.email });

      if (userExist) {
        return res
          .status(400)
          .json({ errors: [{ msg: "The User Is Already Exist" }] });
      }

      const avatar = gravatar.url(req.body.email, {
        s: "200",
        r: "pg",
        d: "mm",
      });

      const user = new User({
        ...req.body,
        avatar,
      });

      const hashPassword = await bcrypt.hash(req.body.password, 8);

      user.password = hashPassword;
      await user.save();

      const payload = {
        user: {
          id: user.id,
        },
      };

      const token = jwt.sign(payload, config.get("JWT_SECRET"));

      res.status(201).json({ token });
    } catch (e) {
      console.error(e);
      res.status(500).send("Server Error");
    }
  },
];

module.exports = { registeredUser };
