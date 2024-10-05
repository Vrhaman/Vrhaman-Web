const mongoose = require('mongoose');
const Booking = require("@models/Booking");
const MarketPlace = require("@models/MarketPlace");

const bookARide = async (req, res) => {
  try {
    const userId = req.user._id;
    const {
      vehicleId,
      pickUpPoint,
      pickUpTime,
      dropTime,
      dropDate,
      pickUpDate,
      totalHour,
      price,
      helmet,
      transactionId
    } = req.body;

    const booking = await Booking.create({
      user: userId,
      vehicle: vehicleId,
      pickUpPoint,
      dropDate,
      pickUpDate,
      pickUpTime,
      dropTime,
      totalHour,
      price,
      helmet,
      transactionId
    });

    res.status(201).json({
      success: true,
      message: "Booking started successfully",
      booking,
    });
  } catch (error) {
    console.error("Error starting booking:", error);
    res
      .status(500)
      .json({ success: false, message: "Failed to start booking" });
  }
};

const getUserBookings = async (req, res) => {
  try {
    const userId = req.user._id;
    const { status, page = 1, limit = 10 } = req.query;

    const options = {
      page: parseInt(page, 10),
      limit: parseInt(limit, 10),
    };

    const query = { user: userId };
    if (status) query.status = status;

    const userBookings = await Booking.find(query)
      .sort({ createdAt: -1 })
      .skip((options.page - 1) * options.limit)
      .limit(options.limit);

    const total = await Booking.countDocuments(query);

    res.json({
      success: true,
      total,
      totalPages: Math.ceil(total / options.limit),
      currentPage: options.page,
      bookings: userBookings,
    });
  } catch (error) {
    console.error("Error fetching user bookings:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch user bookings",
    });
  }
};

const getCustomerBookingHistory = async (req, res) => {
  try {
    const customerId = req.user._id;
    const { page = 1, limit = 10 } = req.query;

    const options = {
      page: parseInt(page, 10),
      limit: parseInt(limit, 10),
    };

    const query = { customer: customerId };

    const customerBookings = await Booking.find(query)
      .sort({ createdAt: -1 })
      .skip((options.page - 1) * options.limit)
      .limit(options.limit);

    const total = await Booking.countDocuments(query);

    res.json({
      success: true,
      total,
      totalPages: Math.ceil(total / options.limit),
      currentPage: options.page,
      bookings: customerBookings,
    });
  } catch (error) {
    console.error("Error fetching customer bookings:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch customer bookings",
    });
  }
};

const getCustomerBookings = async (req, res) => {
  try {
    const customerId = req.user._id;
    const { page = 1, limit = 10 } = req.query;

    const options = {
      page: parseInt(page, 10),
      limit: parseInt(limit, 10),
    };

    const pipeline = [
      {
        $match: {
          status: 'Pending',
        }
      },
      {
        $lookup: {
          from: 'customers',
          localField: 'vehicle',
          foreignField: 'marketPlace',
          as: 'customerDetails'
        }
      },
      {
        $unwind: '$customerDetails'
      },
      {
        $match: {
          'customerDetails._id': new mongoose.Types.ObjectId(customerId),
        }
      },
      {
        $sort: { createdAt: -1 }
      },
      {
        $skip: (options.page - 1) * options.limit
      },
      {
        $limit: options.limit
      },
      {
        $project: {
          _id: 1,
          user: 1,
          status: 1,
          vehicle: 1,
          pickUpPoint: 1,
          pickUpDate: 1,
          dropDate: 1,
          pickUpTime: 1,
          dropTime: 1,
          totalHour: 1,
          price: 1,
          helmet: 1,
          createdAt: 1,
          updatedAt: 1,
        }
      }
    ];

    const customerBookings = await Booking.aggregate(pipeline);
    const total = customerBookings.length;

    res.json({
      success: true,
      total,
      totalPages: Math.ceil(total / options.limit),
      currentPage: options.page,
      bookings: customerBookings,
    });
  } catch (error) {
    console.error("Error fetching customer bookings:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch customer bookings",
    });
  }
};

const cancelBooking = async (req, res) => {
  try {
    const bookingId = req.params.bookingId;
    const userId = req.user._id;

    const booking = await Booking.findById(bookingId);
    if (!booking) {
      return res
        .status(404)
        .json({ success: false, message: "Booking not found" });
    }

    if (booking.user.toString() !== userId.toString()) {
      return res.status(403).json({
        success: false,
        message: "Unauthorized to cancel this booking",
      });
    }

    if (booking.status === "Canceled") {
      return res
        .status(400)
        .json({ success: false, message: "Booking is already canceled" });
    }

    booking.status = "Canceled";
    await booking.save();

    res.status(200).json({
      success: true,
      message: "Booking canceled successfully",
      booking,
    });
  } catch (error) {
    console.error("Error canceling booking:", error);
    res
      .status(500)
      .json({ success: false, message: "Failed to cancel booking" });
  }
};

const acceptBooking = async (req, res) => {
  try {
    const bookingId = req.query.bookingId;
    const customerId = req.user?._id;

    const booking = await Booking.findById(bookingId);

    if (!booking) {
      return res
        .status(404)
        .json({ success: false, message: "Booking not found" });
    }

    if (booking.status === "Canceled") {
      return res
        .status(400)
        .json({ success: false, message: "Booking is canceled" });
    }

    if (booking.status === "Booked") {
      return res
        .status(400)
        .json({ success: false, message: "Already Booked" });
    }

    const vehicle = await MarketPlace.findById(booking.vehicle);
    if (!vehicle) {
      return res.status(403).json({
        success: false,
        message: "You don't have permission to accept this booking",
      });
    }

    booking.status = "Booked";
    booking.customer = customerId;
    await booking.save();

    res
      .status(200)
      .json({ success: true, message: "Booking accepted", booking });
  } catch (error) {
    console.error("Error accepting booking:", error);
    res
      .status(500)
      .json({ success: false, message: "Failed to accept booking" });
  }
};

const getBookingDetails = async (req, res) => {
  try {
    const booking = await Booking.findById(req.query.bookingId)
      .populate("user", "name mobile email")
      .populate({
        path: "customer",
        select: "name mobile email location",
      })
      .populate("vehicle", "name price image model speedLimit category cc");

    if (!booking) {
      return res
        .status(404)
        .json({ success: false, message: "Booking not found" });
    }

    res.status(200).json({
      success: true,
      bookingData: {
        customer: booking?.customer,
        user: booking?.user,
        vehicle: booking?.vehicle,
        booking: {
          _id: booking?._id,
          dropDate: booking?.dropDate,
          dropTime: booking?.dropTime,
          pickUpDate: booking?.pickUpDate,
          pickUpPoint: booking?.pickUpPoint,
          pickUpTime: booking?.pickUpTime,
          status: booking?.status,
          price: booking?.price,
        },
      },
    });
  } catch (error) {
    console.error("Error fetching booking details:", error);
    res
      .status(500)
      .json({ success: false, message: "Failed to fetch booking details" });
  }
};

module.exports = {
  bookARide,
  cancelBooking,
  getCustomerBookings,
  getUserBookings,
  acceptBooking,
  getBookingDetails,
  getCustomerBookingHistory
};
