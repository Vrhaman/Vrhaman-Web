const express = require("express");

const {
  RegisterCustomer,
  GetCustomer,
  EditCustomer,
  SwitchCustomer,
} = require("@controllers");
const userAuthMiddleware = require("../middlewares/userAuth");
const customerAuthMiddleware = require("../middlewares/customerAuth");

const router = express.Router();

router.route("/sign-up").post(RegisterCustomer);

router.route("/get").get(customerAuthMiddleware, GetCustomer);

router.route("/edit").put(customerAuthMiddleware, EditCustomer);

router.route("/join").post(userAuthMiddleware, async (req, res) => {
  try {
    const userId = req.user._id;

    if (!userId) {
      return res
        .status(400)
        .json({ success: false, message: "User ID is required" });
    }

    const customer = await SwitchCustomer(userId, res);

    res.status(200).json({
      success: true,
      message: "Switched to customer successfully",
      customer,
    });
  } catch (error) {
    console.error("Error switching to customer:", error.message);
    res
      .status(500)
      .json({ success: false, message: "Failed to switch to customer" });
  }
});

module.exports = router;
