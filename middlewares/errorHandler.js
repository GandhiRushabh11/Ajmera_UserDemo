const AppError = require("../utils/AppError");

const handleJoiValidationError = (error) => {
  const message = error.details.map((detail) => detail.message).join(", ");
  return new AppError(message, 400);
};

const errorHandler = (err, req, res, next) => {
  // Copy error object to avoid mutations
  let error = { ...err, message: err.message };
  let statusCode = err.statusCode || 500;

  // Handle different error types
  if (err.isJoi) {
    error = handleJoiValidationError(err);
    statusCode = error.statusCode;
  } else if (err.name === "CastError") {
    error.message = `Invalid ${err.path}: ${err.value}`;
    statusCode = 400;
  } else if (err.code === 11000) {
    error.message = `Duplicate field value entered`;
    statusCode = 400;
  }

  // Handle application-specific errors
  if (err.isOperational) {
    return res.status(statusCode).json({
      success: false,
      error: {
        message: error.message,
      },
    });
  } else {
    res.status(statusCode).json({
      success: false,
      message: error.isOperational
        ? error.message
        : "Something went wrong. Please try again later.",
    });
  }
};

module.exports = errorHandler;
