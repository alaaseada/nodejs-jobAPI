require('dotenv').config();
const jwt = require('jsonwebtoken');
const CustomAPIError = require('../errors/custom-error');
const { StatusCodes } = require('http-status-codes');
const User = require('../models/User');
const nodemailer = require('nodemailer');

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

const getUserByMail = async (email) => {
  const user = await User.findOne({ email });
  if (!user)
    throw new CustomAPIError(
      StatusCodes.BAD_REQUEST,
      `No user was found with email ${email}`
    );
  return user;
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
    throw new CustomAPIError(
      StatusCodes.BAD_REQUEST,
      `Invalid credentials. please recheck your password.`
    );
  }
  const token = user.createJWT();
  res.status(StatusCodes.OK).json({ user: { name: user.name }, token });
};

const deleteUser = async (req, res) => {
  const { id: _id } = req.params;
  const user = await User.findOneAndDelete({ _id });
  res
    .status(StatusCodes.OK)
    .json({ user: { name: user.name, email: user.email } });
};

const verifyToken = async (stored_token, params_token) => {
  const stored_decoded = jwt.verify(stored_token, process.env.JWT_SECRET_KEY);
  const params_decoded = jwt.verify(params_token, process.env.JWT_SECRET_KEY);
  const verified =
    stored_decoded.id === params_decoded.id &&
    stored_decoded.email === params_decoded.email;
  return { verified, id: stored_decoded.id };
};

const resetPassword = async (req, res) => {
  try {
    const { stored_token, params_token, password } = req.body;
    const { verified, id: _id } = await verifyToken(stored_token, params_token);
    if (verified) {
      const user = await User.findById(_id);
      if (!user)
        throw new CustomAPIError(
          StatusCodes.BAD_REQUEST,
          'You are not authorized to reset the password.'
        );
      user.password = password;
      user.save();
      res.status(StatusCodes.OK).json({ user });
    } else {
      throw new CustomAPIError(
        StatusCodes.BAD_REQUEST,
        'You are not authorized to reset the password.'
      );
    }
  } catch (err) {
    console.log(err);
  }
};

const sendAnEmail = async (req, res) => {
  const { email } = req.body;
  const user = await getUserByMail(email);
  const token = user.createJWT();

  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.MAIL,
      pass: process.env.MAILPASSWORD,
    },
    tls: {
      rejectUnauthorized: false,
    },
  });
  const mailOptions = {
    from: process.env.MAIL,
    to: email,
    subject: 'Job Tracking App: Reset Password',
    text: `Please follow this link to reset your password. 
    http://localhost:3000/reset-password.html?token=${token}`,
  };

  transporter.sendMail(mailOptions, (err, info) => {
    if (err) {
      console.log(err);
      throw new CustomAPIError(
        StatusCodes.INTERNAL_SERVER_ERROR,
        `An error occurred while sending the email. ${err}`
      );
    } else {
      res
        .status(StatusCodes.OK)
        .json({ msg: `Mail was sent: ${info.response}`, user, token });
    }
  });
};

module.exports = {
  getAllUsers,
  getUser,
  register,
  login,
  deleteUser,
  resetPassword,
  sendAnEmail,
};
