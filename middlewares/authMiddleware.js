const jwt = require("jsonwebtoken");
const AppError = require("../utils/AppError");
const User = require("../models/userModel");

const protect = async (req, res, next) => {
  let token;

  // Check for the token in the authorization header
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    token = req.headers.authorization.split(" ")[1];
  }

  if (!token) {
    return next(new AppError("Not authorized to access this route", 401));
  }

  try {
    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Attach user ID to request
    req.user = await User.findByPk(decoded.id);

    next();
  } catch (err) {
    return next(new AppError("Not authorized to access this route", 401));
  }
};

const authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user || !req.user.role) {
      return next(new AppError("User role not found", 403));
    }

    if (!roles.includes(req.user.role)) {
      return next(new AppError("Not authorized to access this route", 403));
    }

    next();
  };
};

module.exports = { protect, authorize };
