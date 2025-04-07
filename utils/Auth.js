const jwt = require("jsonwebtoken");
const User = require("../model/User");

const verifyToken = async (req, res, next) => {
  try {
    const token = req.header("Authorization")?.split(" ")[1];
    if (!token) {
      return res
        .status(401)
        .json({ message: "Unauthorized", error: "Token missing" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id);
    if (!user) {
      return res
        .status(401)
        .json({ message: "Unauthorized", error: "User not found" });
    }

    req.user = user;
    next();
  } catch (error) {
    return res
      .status(401)
      .json({ message: "Unauthorized", error: error.message });
  }
};

const verifyEmployer = (req, res, next) => {
  if (req.user.role !== "employer") {
    return res
      .status(403)
      .json({ message: "Access denied", error: "Access denied" });
  }
  next();
};

module.exports = { verifyEmployer, verifyToken };
