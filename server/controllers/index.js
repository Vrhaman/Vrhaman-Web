const User = require("./user/User");
const Customer = require("./customer/Customer");
const Booking = require("./booking/Booking");
const MarketPlace = require("./marketplace/MarketPlace");

module.exports = {
  // User
  SendUserOtp: User.sendOtpController,
  VerifyUserOtp: User.verifyOtpController,
  RegisterUser: User.signUpController,
  GetUser: User.getUserController,
  EditUser: User.editUserController,
  LogoutUser: User.userLogoutController,

  // Customer
  RegisterCustomer: Customer.signUpController,
  GetCustomer: Customer.getCustomerController,
  EditCustomer: Customer.editCustomerController,
  SwitchCustomer: Customer.switchToCustomerController,

  // Booking
  BookRide: Booking.bookARide,
  CancelBooking: Booking.cancelBooking,
  GetCustomerBookings: Booking.getCustomerBookings,
  GetUserBookings: Booking.getUserBookings,
  AcceptBooking: Booking.acceptBooking,
  GetBookingDetails: Booking.getBookingDetails,
  CustomerBookingHistory: Booking.getCustomerBookingHistory,

  // MarketPlace
  AddProduct: MarketPlace.addProduct,
  GetAllProducts: MarketPlace.getAllProducts,
  GetAllProductsNames: MarketPlace.getAllVehicleNames,
  GetCustomerProduct: MarketPlace.getCustomerProducts,
  GetFilteredProduct: MarketPlace.getFilteredProduct,
  GetProduct: MarketPlace.getProductDetail,
  DeleteProduct: MarketPlace.deleteProduct,
  CheckAvailability: MarketPlace.checkAvailability,
};
