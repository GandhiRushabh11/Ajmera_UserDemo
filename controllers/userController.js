const User = require("../models/userModel");

exports.createUser = async (req, res, next) => {
  try {
    const { name, email, password, role } = req.body;

    const user = await User.create({ name, email, password, role });
    res.status(201).json(user);
  } catch (error) {
    console.log(error);
  }
};
