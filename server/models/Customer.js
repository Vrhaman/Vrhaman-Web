const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");

const CustomerSchema = mongoose.Schema(
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
    role: {
      type: String,
      default: "Customer",
    },
    email: {
      type: String,
      trim: true,
      default: "N/A",
    },
    dob: {
      type: String,
      trim: true,
      default: "N/A",
    },
    gender: {
      type: String,
      enum: ["Male", "Female", "Other"],
    },
    marketPlace: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "MarketPlace",
      },
    ],
    location: {
      type: String,
      default: "N/A",
    },
    aadhaarNo: {
      type: String,
      default: "N/A",
    },
    gstNo: {
      type: String,
      default: "N/A",
    },
  },
  {
    timestamps: true,
  }
);

CustomerSchema.methods.generateAuthToken = function () {
  const token = jwt.sign(
    { _id: this._id, name: this.name, role: this.role },
    process.env.JWT_SECRET,
    { expiresIn: process.env.EXPIRES_IN }
  );
  return token;
};

const Customer = mongoose.model("Customer", CustomerSchema);

module.exports = Customer;
