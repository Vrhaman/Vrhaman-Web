const axios = require("axios");
const User = require("@models/User");
const Customer = require("@models/Customer");
const Otp = require("@models/Otp");

const sendOtpController = async (mobileNumber) => {
  const otp = Math.floor(100000 + Math.random() * 900000);
  console.log(otp);

  let existingOtp = await Otp.findOne({ mobileNumber });

  if (existingOtp) {
    existingOtp.storedOTP = otp;
    existingOtp.expirationTime = Date.now() + 5 * 60 * 1000;
    await existingOtp.save();
  } else {
    await Otp.create({
      mobileNumber: mobileNumber,
      storedOTP: otp,
      expirationTime: Date.now() + 5 * 60 * 1000,
    });
  }

  const response = await axios.get("https://www.fast2sms.com/dev/bulkV2", {
    params: {
      authorization: process.env.FAST2SMS_API_KEY,
      variables_values: otp,
      route: "otp",
      numbers: mobileNumber,
      flash: 0,
    },
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
  });

  return { success: true, message: "OTP sent successfully!" };
};

const verifyOtpController = async (mobileNumber, otp) => {
  const otpObject = await Otp.findOne({ mobileNumber });

  if (!otpObject) {
    throw new Error("Mobile number not found or OTP expired.");
  }

  const { storedOTP, expirationTime } = otpObject;

  if (storedOTP !== otp || Date.now() >= expirationTime) {
    throw new Error("Invalid OTP or OTP expired.");
  }

  await Otp.deleteOne({ mobileNumber });

  return { success: true, message: "OTP verification successful!" };
};

const signUpController = async (req, res) => {
  try {
    const { mobile, name, gender, licenceNo, aadhaarNo, location } = req.body;

    const existingUser = await User.findOne({ mobile });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "Mobile number is already registered.",
      });
    }

    const newUser = new User({
      mobile,
      name,
      gender,
      licenceNo,
      aadhaarNo,
      location,
    });

    await newUser.save();
    await sendOtpController(mobile);

    res
      .status(201)
      .json({ success: true, message: "User registered successfully." });
  } catch (error) {
    console.error("Error signing up:", error.message);
    res.status(500).json({ success: false, message: "Failed to sign up." });
  }
};

const getUserController = async (req, res) => {
  try {
    const userId = req?.user?._id;

    if (!userId) {
      return res.status(401).json({ message: "userId is misssing" });
    }

    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({ success: true, userData: user });
  } catch (error) {
    console.error("Error fetching user data:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const editUserController = async (req, res) => {
  try {
    const { fullName, gender, licenceNo, kyc, location, dob, email, dl } =
      req.body;
    const userId = req.user._id;

    const updatedUserData = {};
    if (fullName) updatedUserData.name = fullName;
    if (gender) updatedUserData.gender = gender;
    if (dl) updatedUserData.licenceNo = licenceNo;
    if (kyc) updatedUserData.aadhaarNo = kyc;
    if (email) updatedUserData.email = email;
    if (dob) updatedUserData.dob = dob;
    if (email) updatedUserData.email = email;

    const updatedUser = await User.findByIdAndUpdate(userId, updatedUserData, {
      new: true,
    });

    if (!updatedUser) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    res.status(200).json({ success: true, user: updatedUser });
  } catch (error) {
    console.error("Error updating user data:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

const userLogoutController = async (req, res) => {
  try {

    const domain = process.env.DOMAIN_URL;
    const cookieOptions = {
      domain: domain,
      secure: true,
      sameSite: "None"
    };

    res.clearCookie("userId", cookieOptions);
    res.clearCookie("token", cookieOptions);
    res.clearCookie("loggedIn", cookieOptions);
    res.clearCookie("role", cookieOptions);


    res
      .status(200)
      .json({ success: true, message: "Logged out successfully." });
  } catch (error) {
    console.error("Error logging out:", error.message);
    res.status(500).json({ success: false, message: "Failed to log out." });
  }
};

module.exports = {
  sendOtpController,
  verifyOtpController,
  signUpController,
  getUserController,
  editUserController,
  userLogoutController,
};
