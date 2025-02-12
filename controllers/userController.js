const User = require("../models/userModel");
const AppError = require("../utils/AppError");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const userSchema = require("../validations/userSchema");
const loginSchema = require("../validations/loginSchema");
const updateSchema = require("../validations/updateSchema");

exports.registerUser = async (req, res, next) => {
  try {
    // Validate request body
    const { error } = userSchema.validate(req.body);

    if (error) {
      return next(error);
    }
    const { name, email, password, role } = req.body;

    // Check if user with email already exists
    const existingUser = await User.findOne({ where: { email } });

    if (existingUser) {
      return next(new AppError("Email already exists", 400));
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      role,
    });
    // Use sendResponseToken instead of direct response
    sendResponseToken(user, 201, res);
  } catch (error) {
    next(error);
  }
};

exports.getAllUsers = async (req, res, next) => {
  try {
    const users = await User.findAll({ attributes: { exclude: ["password"] } });
    res.status(200).json({ success: true, data: users });
  } catch (error) {
    next(error);
  }
};

exports.getUser = async (req, res, next) => {
  try {
    const user = await User.findByPk(req.params.id, {
      attributes: { exclude: ["password"] },
    });

    if (!user) {
      return next(new AppError("No user found with that ID", 404));
    }

    res.status(200).json({ success: true, data: user });
  } catch (error) {
    next(error);
  }
};

exports.deleteUser = async (req, res, next) => {
  try {
    const user = await User.findByPk(req.params.id);

    if (!user) {
      return next(new AppError("No user found with that ID", 404));
    }

    await user.destroy();
    res.status(204).json({
      success: true,
      data: null,
    });
  } catch (error) {
    next(error);
  }
};

exports.updateUser = async (req, res, next) => {
  try {
    // Validate request body
    const { error } = updateSchema.validate(req.body);
    if (error) {
      return next(error);
    }
    const user = await User.findByPk(req.params.id);

    if (!user) {
      return next(new AppError("No user found with that ID", 404));
    }

    // Update user with request body data
    await user.update(req.body);

    res.status(200).json({
      success: true,
      data: user,
    });
  } catch (error) {
    next(error);
  }
};

exports.loginUser = async (req, res, next) => {
  try {
    const { error } = loginSchema.validate(req.body);
    console.log(error);

    if (error) {
      return next(error);
    }
    const { email, password } = req.body;

    // Find user by email
    const user = await User.findOne({ where: { email } });

    // Check if user exists and password is correct

    const isMatch = await bcrypt.compare(password, user.password);

    if (!user || !isMatch) {
      return next(new AppError("Incorrect email or password", 401));
    }

    // Use sendResponseToken instead of direct response
    sendResponseToken(user, 200, res);
  } catch (error) {
    next(error);
  }
};

const sendResponseToken = (user, statusCode, res) => {
  // Create JWT token
  const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });

  // Remove password from output
  user.password = undefined;

  res.status(statusCode).json({
    success: true,
    token,
    data: user,
  });
};
