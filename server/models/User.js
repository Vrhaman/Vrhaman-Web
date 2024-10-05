const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");

const UserSchema = new mongoose.Schema(
  {
    mobile: {
      type: String,
      match: /^(\+\d{1,3}[- ]?)?\d{10}$/,
      required: true,
      trim: true,
      unique: true,
    },
    name: {
      type: String,
      trim: true,
      default: "N/A",
    },
    dob: {
      type: String,
      trim: true,
      default: "N/A",
    },
    email: {
      type: String,
      trim: true,
      default: "N/A",
    },
    role: {
      type: String,
      default: "User",
    },
    gender: {
      type: String,
      enum: ["Male", "Female", "Other"],
    },
    licenceNo: {
      type: String,
      default: "N/A",
    },
    aadhaarNo: {
      type: String,
      default: "N/A",
    },
  },
  {
    timestamps: true,
  }
);

UserSchema.methods.generateAuthToken = function () {
  const token = jwt.sign(
    { _id: this._id, name: this.name, role: this.role },
    process.env.JWT_SECRET,
    { expiresIn: process.env.EXPIRES_IN }
  );
  return token;
};

const User = mongoose.model("User", UserSchema);

module.exports = User;
