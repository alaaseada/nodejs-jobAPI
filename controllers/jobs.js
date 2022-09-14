require('dotenv').config();
const mongoose = require('mongoose');
const Job = require('../models/Job');
const jwt = require('jsonwebtoken');
const { StatusCodes } = require('http-status-codes');

const getAllJobs = async (req, res) => {
  const { id } = req.user;
  const jobs = await Job.find({ userId: id }).sort({ lastModified: 'desc' });
  res.status(StatusCodes.OK).json({ jobs });
};

const getOneJob = async (req, res) => {
  const { id: _id } = req.params;
  const job = await Job.findOne({ _id });
  res.status(StatusCodes.OK).json({ job });
};
const addJob = async (req, res) => {
  const { id } = req.user;
  const job = await Job.create({ ...req.body, userId: id });
  res.status(StatusCodes.CREATED).json({ job });
};

const deleteJob = async (req, res) => {
  const { id: userId } = req.user;
  const { id: jobId } = req.params;
  const job = await Job.findOneAndDelete({ _id: jobId, userId });
  res.status(StatusCodes.OK).json({ job });
};

const updateJob = async (req, res) => {
  const { id: _id } = req.params;
  const job = await Job.findOneAndUpdate(
    { _id },
    { ...req.body, lastModified: new Date() },
    { new: true, runValidators: true }
  );
  res.status(StatusCodes.OK).json({ job });
};

module.exports = {
  getAllJobs,
  addJob,
  deleteJob,
  updateJob,
  getOneJob,
};
