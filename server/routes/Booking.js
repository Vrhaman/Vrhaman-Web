const express = require("express");
const customerAuthMiddleware = require("@middlewares/customerAuth");
const userAuthMiddleware = require("@middlewares/userAuth");
const checkUserRole = require("@middlewares/role");
const {
  BookRide,
  CancelBooking,
  GetCustomerBookings,
  GetUserBookings,
  AcceptBooking,
  GetBookingDetails,
  CustomerBookingHistory,
} = require("./../controllers");

const router = express.Router();

router.route("/book").post(userAuthMiddleware, BookRide);

router.route("/cancel-booking").post(userAuthMiddleware, CancelBooking);

router
  .route("/customer/bookings")
  .get(customerAuthMiddleware, checkUserRole("Customer"), GetCustomerBookings);

router
  .route("/customer/booking-history")
  .get(customerAuthMiddleware, checkUserRole("Customer"), CustomerBookingHistory);

router.route("/user/booking-history").get(userAuthMiddleware, GetUserBookings);

router
  .route("/accept-booking")
  .post(customerAuthMiddleware, checkUserRole("Customer"), AcceptBooking);

router.route("/booking/get").get(GetBookingDetails);

module.exports = router;
