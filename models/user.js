const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Please provide a name"],
    maxlength: [40, "Name should be 40 character"],
  },
  email: {
    type: String,
    required: [true, "Please provide a email"],
    validate: [validator.isEmail, "please enter a valid email"],
    unique: true,
  },
  password: {
    type: String,
    required: [true, "Please provide a email"],
    minlength: [6, "Password should be atleast 6 character"],
    select: false,
  },
  role: {
    type: String,
    default: "user",
  },
  
  forgotPasswordToken: String,
  forgotPasswordExpry: Date,
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

//encrypt password
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    return next();
  }
  this.password = await bcrypt.hash(this.password, 10);
});

userSchema.methods.validatePassword = async function (sentPassword) {
  return await bcrypt.compare(sentPassword, this.password);
};

//create jwt
userSchema.methods.getJwtToken = function () {
  return jwt.sign({ id: this._id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRY,
  });
};

//generate reset password token
userSchema.methods.getResetPass = function () {
  const forgotToken = crypto.randomBytes(20).toString("hex");
  // creating a hash
  this.forgotPasswordToken = crypto
    .createHash("sha256")
    .update(forgotToken)
    .digest("hex");
  // time of token
  this.forgotPasswordExpry = Date.now() + 20 * 60 * 1000;

  return forgotToken;
};

module.exports = mongoose.model("User", userSchema);