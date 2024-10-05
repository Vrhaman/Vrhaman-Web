const mongoose = require("mongoose");

const BookingSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    customer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Customer",
    },
    status: {
      type: String,
      default: "Pending",
      enum: ["Pending", "Booked", "Canceled"],
    },
    vehicle: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "MarketPlace",
      required: true,
    },
    pickUpPoint: {
      type: String,
      required: true,
    },
    pickUpDate: {
      type: String,
      required: true,
    },
    dropDate: {
      type: String,
      required: true,
    },
    pickUpTime: {
      type: String,
      required: true,
    },
    dropTime: {
      type: String,
      required: true,
    },
    totalHour: {
      type: Number,
    },
    price: {
      type: Number,
      required: true,
    },
    helmet: {
      type: Number,
      default: 1,
      required: true,
    },
    transactionId: {
      type: String,
      required: true
    }
  },
  {
    timestamps: true,
  }
);

const Booking = mongoose.model("Booking", BookingSchema);

module.exports = Booking;
