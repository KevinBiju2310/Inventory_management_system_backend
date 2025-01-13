const bcrypt = require("bcryptjs");
const {
  generateAccessToken,
  generateRefreshToken,
} = require("../utils/tokens");
const userModel = require("../Models/userSchema");

const signUp = async (req, res) => {
  const { email, password } = req.body;
  try {
    const existingEmail = await userModel.findOne({ email });
    if (existingEmail) {
      return res.status(400).json({ message: "Email already exits" });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new userModel({
      email,
      password: hashedPassword,
    });
    const saveUser = await newUser.save();
    if (!saveUser) {
      return res.status(500).json({ message: "Error creating user" });
    }
    res.status(201).json({ message: "User created Successfully" });
  } catch (error) {
    res.status(500).json({ message: "Internet server error" });
  }
};

const signIn = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await userModel.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      return res.status(401).json({ message: "Password is incorrect" });
    }
    const accessToken = generateAccessToken(user._id);
    const refreshToken = generateRefreshToken(user._id);
    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite:"None",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });
    res.cookie("accessToken", accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite:"None",
      maxAge: 15 * 60 * 1000,
    });
    res.status(200).json({ message: "Login successfull", user });
  } catch (error) {
    res.status(500).json({ message: "Internet server error" });
  }
};

const logOut = (req, res) => {
  res.clearCookie("accessToken");
  res.clearCookie("refreshToken");
  res.status(200).json({ message: "Logged out successfully" });
};

module.exports = {
  signUp,
  signIn,
  logOut,
};
