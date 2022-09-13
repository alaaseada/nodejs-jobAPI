require('dotenv').config()
const jwt = require('jsonwebtoken')
const CustomAPIError = require('../errors/custom-error')
const { StatusCodes } = require('http-status-codes')

const authenticateUser = async (req, res, next) => {
  const auth_header = req.headers.authorization
  if (!auth_header || !auth_header.startsWith('Bearer ')) {
    throw new CustomAPIError(
      StatusCodes.UNAUTHORIZED,
      `Please 
            <a style="text-decoration: underline;" href='/users/login.html'>login</a> first to access this page.`,
    )
  }
  const token = auth_header.split(' ')[1]
  const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY)
  const { id, email } = decoded
  req.user = { id, email }
  next()
}

module.exports = authenticateUser
