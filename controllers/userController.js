const User = require("../models/userModel");

exports.createUser = async (req, res, next) => {
  try {
    const { name, email, password, role } = req.body;

    // Check if user with email already exists
    const existingUser = await User.findOne({ where: { email } });

    if (existingUser) {
      return next(new AppError("Email already exists", 400));
    }

    const user = await User.create({ name, email, password, role });
    res.status(201).json(user);
  } catch (error) {
    next(error);
  }
};
