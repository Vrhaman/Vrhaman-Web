const MarketPlace = require("@models/MarketPlace");
const mongoose = require("mongoose");
const Customer = require("@models/Customer");

const addProduct = async (req, res) => {
  try {
    const customerId = req.user._id;
    const { marketplaceId } = req.query;

    const customer = await Customer.findById(customerId);

    if (!customer) {
      return res
        .status(404)
        .json({ success: false, message: "Customer not found" });
    }

    customer.marketPlace.push(marketplaceId);

    await customer.save();

    return res.status(201).json({
      success: true,
      message: "Marketplace added to customer successfully",
    });
  } catch (error) {
    console.error("Error adding marketplace to customer:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to add marketplace to customer",
    });
  }
};

const getAllProducts = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;

    const skip = (page - 1) * limit;

    const products = await MarketPlace.find().skip(skip).limit(limit);

    res.json({ success: true, products: products });
  } catch (error) {
    console.error("Error fetching products:", error);
    res
      .status(500)
      .json({ success: false, message: "Failed to fetch products." });
  }
};

const getAllVehicleNames = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit);
    const skip = (page - 1) * limit;

    const vehicles = await MarketPlace.find({}, "_id name")
      .skip(skip)
      .limit(limit);

    res.json({
      success: true,
      vehicles: vehicles.map((vehicle) => ({
        id: vehicle._id,
        name: vehicle.name,
      })),
    });
  } catch (error) {
    console.error("Error fetching vehicle names with IDs:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch vehicle names with IDs.",
    });
  }
};

const getCustomerProducts = async (req, res) => {
  try {
    const customerId = req.user._id;

    const customer = await Customer.findById(customerId).populate(
      "marketPlace"
    );

    if (!customer) {
      return res
        .status(404)
        .json({ success: false, message: "Customer not found" });
    }

    console.log(customer);

    res.json({ success: true, products: customer.marketPlace });
  } catch (error) {
    console.error("Error fetching products:", error);
    res
      .status(500)
      .json({ success: false, message: "Failed to fetch products." });
  }
};

const getFilteredProduct = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit);

    const skip = (page - 1) * limit;
    let filters = {};

    if (req.query.name) {
      filters.name = new RegExp(req.query.name, "i");
      delete req.query.name;
    }
    Object.assign(filters, req.query);

    const products = await MarketPlace.find(filters).skip(skip).limit(limit);

    res.json({ success: true, products: products });
  } catch (error) {
    console.error("Error fetching products:", error);
    res
      .status(500)
      .json({ success: false, message: "Failed to fetch products." });
  }
};

const getProductDetail = async (req, res) => {
  try {
    const productId = req.query.productId;
    const product = await MarketPlace.findById(productId);

    if (!product) {
      return res
        .status(404)
        .json({ success: false, message: "Product not found." });
    }

    res.json({ success: true, product: product });
  } catch (error) {
    console.error("Error fetching product:", error);
    res
      .status(500)
      .json({ success: false, message: "Failed to fetch product." });
  }
};

const deleteProduct = async (req, res) => {
  try {
    const customerId = req.user._id;
    const { marketplaceId } = req.query;

    const customer = await Customer.findById(customerId);

    if (!customer) {
      return res
        .status(404)
        .json({ success: false, message: "Customer not found" });
    }

    const index = customer.marketPlace.indexOf(marketplaceId);
    if (index === -1) {
      return res.status(404).json({
        success: false,
        message: "Marketplace not found for this customer",
      });
    }

    customer.marketPlace.splice(index, 1);

    await customer.save();

    return res
      .status(200)
      .json({ success: true, message: "Marketplace deleted successfully" });
  } catch (error) {
    console.error("Error deleting marketplace:", error);
    return res
      .status(500)
      .json({ success: false, message: "Failed to delete marketplace" });
  }
};

const checkAvailability = async (req, res) => {
  try {
    const productId = req.query.productId;

    if (!mongoose.Types.ObjectId.isValid(productId[0])) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid bike ID" });
    }

    const bike = await MarketPlace.findById(productId[0]);

    if (!bike) {
      return res
        .status(404)
        .json({ success: false, message: "Bike not found" });
    }

    const customersWithBike = await Customer.find({
      marketPlace: productId[0],
    });

    if (customersWithBike.length > 0) {
      return res
        .status(200)
        .json({ success: true, available: true, message: "Bike is available" });
    } else {
      return res.status(200).json({
        success: true,
        available: false,
        message: "Bike is not available in any customer marketplace",
      });
    }
  } catch (error) {
    console.error("Error checking bike availability:", error);
    res
      .status(500)
      .json({ success: false, message: "Failed to check bike availability" });
  }
};

module.exports = {
  addProduct,
  getCustomerProducts,
  getAllProducts,
  getFilteredProduct,
  getProductDetail,
  deleteProduct,
  getAllVehicleNames,
  checkAvailability,
};
