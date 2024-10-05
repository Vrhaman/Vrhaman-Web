const mongoose = require("mongoose");

const otpSchema = new mongoose.Schema({
  mobileNumber: {
    type: String,
    required: true,
    unique: true,
  },
  storedOTP: {
    type: String,
    required: true,
  },
  expirationTime: {
    type: Date,
    required: true,
  },
});

const Otp = mongoose.model("Otp", otpSchema);

module.exports = Otp;
