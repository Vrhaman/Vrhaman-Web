const express = require("express");
const customerAuthMiddleware = require("@middlewares/customerAuth");
const userAuthMiddleware = require("@middlewares/userAuth");
const checkUserRole = require("@middlewares/role");
const {
  AddProduct,
  GetAllProducts,
  GetCustomerProduct,
  GetFilteredProduct,
  GetProduct,
  DeleteProduct,
  GetAllProductsNames,
  CheckAvailability,
} = require("@controllers");

const router = express.Router();

router.route("/product").get(GetProduct);

router.route("/product/list").get(GetAllProductsNames);

router
  .route("/product/add")
  .post(customerAuthMiddleware, checkUserRole("Customer"), AddProduct);

router
  .route("/product/delete")
  .delete(customerAuthMiddleware, checkUserRole("Customer"), DeleteProduct);

router.route("/get-products").get(GetAllProducts);

router
  .route("/customer/get-products")
  .get(customerAuthMiddleware, checkUserRole("Customer"), GetCustomerProduct);

router.route("/get-products/filter").get(GetFilteredProduct);

router.route("/product/availablity").get(CheckAvailability);

module.exports = router;
