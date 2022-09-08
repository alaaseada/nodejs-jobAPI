require('dotenv').config();
const User = require('../models/user');
const jwt = require('jsonwebtoken');
const CustomAPIError = require('../errors/custom-error');
const { StatusCodes } = require('http-status-codes');
const user = require('../models/user');

const getAllUsers = async (req, res) => {
  const users = await User.find({});
  res
    .status(StatusCodes.OK)
    .json({ msg: 'SUCCESS', count: users.length, users });
};

const getUser = async (req, res) => {
  const { id: _id } = req.params;
  const user = await User.findOne({ _id });
  if (!user)
    return res
      .status(StatusCodes.OK)
      .json({ msg: `No user was found with ID ${_id}` });
  res
    .status(StatusCodes.OK)
    .json({ user: { name: user.name, email: user.email } });
};

const register = async (req, res) => {
  const newUser = await User.create({ ...req.body });
  const token = newUser.createJWT();
  res.status(StatusCodes.CREATED).json({ user: { name: newUser.name }, token });
};

const login = async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    throw new CustomAPIError(
      StatusCodes.BAD_REQUEST,
      'Email and password are required.'
    );
  }
  const user = await User.findOne({ email });
  if (!user) {
    throw new CustomAPIError(
      StatusCodes.BAD_REQUEST,
      `No user was found with this email. (${email})`
    );
  }
  const validPassword = await user.validatePassword(password);
  if (!validPassword) {
    throw new CustomAPIError(StatusCodes.BAD_REQUEST, `Invalid credentials)`);
  }
  const token = user.createJWT();
  res.status(StatusCodes.OK).json({ user: { name: user.name }, token });
};

const deleteUser = async (req, res) => {
  const { id: _id } = req.params;
  const user = await User.findOneAndDelete(_id);
  res
    .status(StatusCodes.OK)
    .json({ user: { name: user.name, email: user.email } });
};

const changePassword = async (req, res) => {
  const auth_header = req.headers.authorization;
  if (!auth_header || !auth_header.startsWith('Bearer ')) {
    return res
      .status(StatusCodes.BAD_REQUEST)
      .json({ msg: 'No tokens are found. Please login first' });
  }
  const decoded = jwt.verify(
    auth_header.split(' ')[1],
    process.env.JWT_SECRET_KEY
  );
  const { id } = decoded;
  const { newPassword } = req.body;
  const user = await User.findByIdAndUpdate(
    id,
    { password: newPassword },
    { new: true, runValidators: true }
  );
  res.status(StatusCodes.OK).json({ user });
};

module.exports = {
  getAllUsers,
  getUser,
  register,
  login,
  deleteUser,
  changePassword,
};
