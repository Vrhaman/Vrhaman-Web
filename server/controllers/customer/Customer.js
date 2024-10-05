const Customer = require("@models/Customer");
const User = require("@models/User");
const setAuthCookie = require("@utils/cookie");

const signUpController = async (req, res) => {
  try {
    const { mobile, name, gender, aadhaarNo, gstNo, location } = req.body;

    const existingCustomer = await Customer.findOne({ mobile });
    if (existingCustomer) {
      return res.status(400).json({
        success: false,
        message: "Mobile number is already registered.",
      });
    }

    const newCustomer = new Customer({
      mobile,
      name,
      gender,
      gstNo,
      aadhaarNo,
      location,
    });

    await newCustomer.save();
    sendOtpController(mobile);

    res
      .status(201)
      .json({ success: true, message: "User registered successfully." });
  } catch (error) {
    console.error("Error signing up:", error.message);
    res.status(500).json({ success: false, message: "Failed to sign up." });
  }
};

const getCustomerController = async (req, res) => {
  try {
    const customerId = req?.user?._id;

    if (!customerId) {
      return res.status(401).json({ message: "customerId is misssing" });
    }

    const customer = await Customer.findById(customerId);

    if (!customer) {
      return res.status(404).json({ message: "Customer not found" });
    }

    res.status(200).json({ success: true, customerData: customer });
  } catch (error) {
    console.error("Error getting customer data:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const editCustomerController = async (req, res) => {
  try {
    const { fullName, gender, location, kyc, gstNo, dob, email } = req.body;
    const customerId = req.user._id;

    const updatedCustomerData = {};
    if (fullName) updatedCustomerData.name = fullName;
    if (email) updatedCustomerData.email = email;
    if (gender) updatedCustomerData.gender = gender;
    if (dob) updatedCustomerData.dob = dob;
    if (location) updatedCustomerData.location = location;
    if (kyc) updatedCustomerData.aadhaarNo = kyc;
    if (gstNo) updatedCustomerData.gstNo = gstNo;

    const updatedCustomer = await Customer.findByIdAndUpdate(
      customerId,
      updatedCustomerData,
      { new: true }
    );

    if (!updatedCustomer) {
      return res
        .status(404)
        .json({ success: false, message: "Customer not found" });
    }

    res.status(200).json({ success: true, customer: updatedCustomer });
  } catch (error) {
    console.error("Error updating customer data:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

const switchToCustomerController = async (userId, res) => {
  try {
    const user = await User.findById(userId);

    if (!user) {
      throw new Error("User not found");
    }
    const { mobile, name, gender, location, aadhaarNo, gstNo } = user;

    const customer = new Customer({
      mobile,
      name,
      role: "Customer",
      gender,
      location,
      aadhaarNo,
      gstNo,
    });
    await customer.save();
    await User.findByIdAndDelete(userId);

    const token = await customer.generateAuthToken();
    setAuthCookie(res, customer._id, customer.role, token);

    return customer;
  } catch (error) {
    throw error;
  }
};

module.exports = {
  signUpController,
  editCustomerController,
  getCustomerController,
  switchToCustomerController,
};
