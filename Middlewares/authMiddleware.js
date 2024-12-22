const { generateAccessToken } = require("../utils/tokens");
const jwt = require("jsonwebtoken");

const verifyToken = (req, res, next) => {
  try {
    const accessToken = req.cookies.accessToken;
    if (accessToken) {
      const decoded = jwt.verify(accessToken, process.env.JWT_SECRET);
      req.user = decoded;
      return next();
    }

    const refreshToken = req.cookies.refreshToken;
    if (!refreshToken) {
      return res.status(401).json({ message: "Authentication required" });
    }
    const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_TOKEN);
    const newAccessToken = generateAccessToken(decoded.userId);
    res.cookie("accessToken", newAccessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 15 * 60 * 1000,
    });
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(500).json({ message: "Internal server error" });
  }
};

module.exports = verifyToken;
