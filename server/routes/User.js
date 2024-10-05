const express = require("express");
const User = require("@models/User");
const Customer = require("@models/Customer");
const userAuthMiddleware = require("@middlewares/userAuth");
const checkUserRole = require("@middlewares/role");
const {
  SendUserOtp,
  VerifyUserOtp,
  RegisterUser,
  EditUser,
  GetUser,
  LogoutUser,
} = require("@controllers");
const { getUserController } = require("@controllers/user/User");
const setAuthCookie = require("@utils/cookie");

const router = express.Router();

router.route("/sign-up").post(RegisterUser);

router.route("/send-otp").post(async (req, res) => {
  try {
    const mobileNumber = req.body && req.body.mobileNumber;

    if (!mobileNumber) {
      return res
        .status(400)
        .json({ success: false, message: "Mobile number is required." });
    }

    let user = await User.findOne({ mobile: mobileNumber });
    let customer = await Customer.findOne({ mobile: mobileNumber });

    if (!user && !customer) {
      user = new User({
        mobile: mobileNumber,
      });
      await user.save();
    }

    const result = await SendUserOtp(mobileNumber);
    res.json(result);
  } catch (error) {
    console.error("Error sending OTP:", error);
    res.status(500).json({ success: false, message: "Failed to send OTP." });
  }
});

router.route("/verify-otp").post(async (req, res) => {
  try {
    const { mobileNumber, otp } = req.body;

    const result = await VerifyUserOtp(mobileNumber, otp);

    const user = await User.findOne({ mobile: mobileNumber });
    const customer = await Customer.findOne({ mobile: mobileNumber });

    let token;
    if (user) {
      token = await user.generateAuthToken();
      setAuthCookie(res, user._id, user.role, token);
    } else if (customer) {
      token = await customer.generateAuthToken();
      setAuthCookie(res, customer._id, customer.role, token);
    }

    if (!user && !customer) {
      throw new Error("User not found.");
    }

    res.status(200).json({ ...result, token: token, login: true });
  } catch (error) {
    console.error("Error verifying OTP:", error.message);
    res.status(500).json({ success: false, message: error.message });
  }
});

router.route("/get").get(userAuthMiddleware, GetUser);

router.route("/logout").post(LogoutUser);

router.route("/edit").put(userAuthMiddleware, EditUser);

module.exports = router;