const mongoose = require("mongoose");
const { string } = require("yargs");

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  avatar: {
    type: String,
  },
  date: {
    type: Date,
    default: Date.now,
  },
});

UserSchema.methods.toJSON = function () {
  const user = this.toObject();

  delete user.password;

  return user;
};

const User = mongoose.model("user", UserSchema);

module.exports = User;
