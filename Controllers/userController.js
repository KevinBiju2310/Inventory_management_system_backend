const bcrypt = require("bcryptjs");
const {
  generateAccessToken,
  generateRefreshToken,
} = require("../utils/tokens");
const userModel = require("../Models/userSchema");
const STATUS = require("../utils/statusCodes");
const MESSAGES = require("../utils/messages");

const signUp = async (req, res) => {
  const { email, password } = req.body;
  try {
    const existingEmail = await userModel.findOne({ email });
    if (existingEmail) {
      return res
        .status(STATUS.BAD_REQUEST)
        .json({ message: MESSAGES.EMAIL_EXISTS });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new userModel({
      email,
      password: hashedPassword,
    });
    const saveUser = await newUser.save();
    if (!saveUser) {
      return res
        .status(STATUS.BAD_REQUEST)
        .json({ message: MESSAGES.ERROR_CREATING_USER });
    }
    res.status(STATUS.OK).json({ message: MESSAGES.USER_CREATED });
  } catch (error) {
    res
      .status(STATUS.INTERNAL_SERVER_ERROR)
      .json({ message: MESSAGES.INTERNAL_SERVER_ERROR });
  }
};

const signIn = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await userModel.findOne({ email });
    if (!user) {
      return res
        .status(STATUS.NOT_FOUND)
        .json({ message: MESSAGES.USER_NOT_FOUND });
    }
    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      return res
        .status(STATUS.UNAUTHORIZED)
        .json({ message: MESSAGES.PASSWORD_INCORRECT });
    }
    const accessToken = generateAccessToken(user._id);
    const refreshToken = generateRefreshToken(user._id);
    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "None",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });
    res.cookie("accessToken", accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "None",
      maxAge: 15 * 60 * 1000,
    });
    res.status(STATUS.OK).json({ message: MESSAGES.LOGIN_SUCCESS, user });
  } catch (error) {
    res
      .status(STATUS.INTERNAL_SERVER_ERROR)
      .json({ message: MESSAGES.INTERNAL_SERVER_ERROR });
  }
};

const logOut = (req, res) => {
  res.clearCookie("accessToken", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "None",
  });

  res.clearCookie("refreshToken", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "None",
  });
  res.status(STATUS.OK).json({ message: MESSAGES.LOGOUT_SUCCESS });
};

module.exports = {
  signUp,
  signIn,
  logOut,
};
