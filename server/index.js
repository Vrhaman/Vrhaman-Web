require("module-alias/register");

const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const morgan = require("morgan");
const cookieParser = require("cookie-parser");
const helmet = require("helmet");

const UserRoutes = require("@routes/User");
const CustomerRoutes = require("@routes/Customer");
const MarketRoutes = require("@routes/MarketPlace");
const BookingRoutes = require("@routes/Booking");

const startServer = require("@utils/server");

dotenv.config();

const app = express();
app.use(express.json());
app.use(cookieParser());

const allowedOrigins = [
  'https://vrhaman.com',
  'https://www.vrhaman.com',
  'http://localhost:3000'
];

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (like mobile apps, curl, postman)
      if (!origin) return callback(null, true);
      if (allowedOrigins.indexOf(origin) === -1) {
        const msg = `The CORS policy for this site does not allow access from the specified origin: ${origin}`;
        return callback(new Error(msg), false);
      }
      return callback(null, true);
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
  })
);

app.use(morgan("[:date[web]] :method :url :status :response-time ms"));
app.use(helmet());

app.get("/", (req, res) => {
  res.send("<h1>Hiii...! I am live.</h1>");
});

app.use("/user", UserRoutes);
app.use("/customer", CustomerRoutes);
app.use("/market", MarketRoutes);
app.use("/", BookingRoutes);

app.use("*", (req, res) => {
  res.status(404).send("API endpoint not found");
});

// Error handling middleware should be at the end
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send("Something went wrong!");
});

startServer(app, () => {
  console.log("Server is running.");
});

module.exports = app;
