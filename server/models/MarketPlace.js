const mongoose = require("mongoose");

const MarketPlaceSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    image: {
      type: String,
      required: true,
    },
    priceForRent: [
      {
        price: { type: Number },
        distance: { type: Number },
        fuelIncluded: { type: Boolean },
      },
    ],
    securityAmount: {
      type: String,
    },
    model: {
      type: String,
      required: true,
    },
    speedLimit: {
      type: String,
      required: true,
    },
    fuelType: {
      type: String,
      required: true,
      enum: ["Petrol", "Diesel", "CNG", "Electric"],
    },
    category: {
      type: String,
      required: true,
      enum: ["Bike", "Scooter", "EV"],
    },
    transmissionType: {
      type: String,
      required: true,
      enum: ["Geared", "Gearless"],
    },
    mileage: {
      type: String,
      required: true,
    },
    fuelCapacity: {
      type: String,
      required: true,
    },
    cc: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      required: true,
      enum: ["Active", "InActive", "Booked"],
    },
  },
  {
    timestamps: true,
  }
);

const MarketPlace = mongoose.model("MarketPlace", MarketPlaceSchema);

module.exports = MarketPlace;
