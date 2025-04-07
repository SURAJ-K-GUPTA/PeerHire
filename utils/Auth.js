const jwt = require("jsonwebtoken");
const User = require("../model/User");

const verifyToken = async (req, res, next) => {
  const token = req.header("Authorization")?.split(" ")[1];
  if (!token) {
    return res.status(401).json({ message: "Unauthorized", error: "Unauthorized" });
  }
  try {
    const user = jwt.verify(token, process.env.JWT_SECRET);
    await User.findById(user.id).then((user) => {
      req.user = user;
    });

    next();
  } catch (error) {
    res.status(401).json({ message: "Unauthorized", error });
  }
};

const verifyEmployer = (req, res, next) => {
  if (req.user.role !== "employer") {
    return res.status(403).json({ message: "Access denied", error: "Access denied" });
  }
  next();
};

module.exports = { verifyEmployer, verifyToken };
