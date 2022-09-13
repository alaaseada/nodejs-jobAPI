require('dotenv').config()
const mongoose = require('mongoose')
const Job = require('../models/Job')
const jwt = require('jsonwebtoken')
const { StatusCodes } = require('http-status-codes')

const getAllJobs = async (req, res) => {
  const { id } = req.user
  const jobs = await Job.find({ userId: id })
  res.status(StatusCodes.OK).json({ jobs })
}

const sayHey = async (req, res) => {
  console.log('Say hey')
}
const addJob = async (req, res) => {
  const { id } = req.user
  const job = await Job.create({ ...req.body, userId: id })
  res.status(StatusCodes.CREATED).json({ job })
}

module.exports = {
  getAllJobs,
  addJob,
  sayHey,
}
