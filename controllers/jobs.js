require('dotenv').config();
const mongoose = require('mongoose');
const Job = require('../models/Job');
const jwt = require('jsonwebtoken');
const { StatusCodes } = require('http-status-codes');

const getAllJobs = async (req, res) => {
  const { id, email } = req.user;
  const jobs = await Job.find({ userId: id });
  res.status(StatusCodes.OK).json({ jobs });
};

module.exports = {
  getAllJobs,
};
