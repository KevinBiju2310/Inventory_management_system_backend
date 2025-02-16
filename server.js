require("dotenv").config();
const mongoose = require("mongoose");
mongoose
  .connect(process.env.MONGODB_URL)
  .then(() => console.log("MongoDB connected Successfully"))
  .catch((err) => console.error("Error occured in connecting database", err));

const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const userRoute = require("./Routes/userRoutes");

const app = express();
app.use(cookieParser());
app.use(
  cors({
    origin: "https://inventory-management-system-frontend-vb56.onrender.com",
    // origin: "http://localhost:5173",
    credentials: true,
  })
);

app.use(express.json());
app.use("/", userRoute);

app.listen(process.env.PORT, () => {
  console.log("Server is running Successfully");
});
