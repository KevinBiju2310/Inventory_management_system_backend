require("dotenv").config();
const mongoose = require("mongoose");
const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const userRoute = require("./Routes/userRoutes");

mongoose
  .connect(process.env.MONGODB_URL)
  .then(() => console.log("MongoDB connected Successfully"))
  .catch((err) => console.error("Error occurred in connecting database", err));

const app = express();

app.use(cookieParser());

const corsOptions = {
  origin: process.env.FRONTEND_URL,
  credentials: true,
};

app.use(cors(corsOptions));
app.options("*", cors(corsOptions));

app.use(express.json());
app.use("/", userRoute);

app.listen(process.env.PORT, () => {
  console.log("Server is running Successfully");
});
