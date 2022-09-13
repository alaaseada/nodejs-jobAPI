const CustomAPIError = require('../errors/custom-error')
const { StatusCodes } = require('http-status-codes')
const { TokenExpiredError } = require('jsonwebtoken')

const errorHandlerMW = async (err, req, res, next) => {
  if (err instanceof TokenExpiredError) {
    return res.status(StatusCodes.UNAUTHORIZED).json({
      msg: `Your session has expired. Please
            <a style="text-decoration: underline;" href='/users/login.html'>login</a> again.`,
    })
  }
  if (err instanceof CustomAPIError) {
    return res.status(err.statusCode).json({ msg: err.message })
  }
  if (err['code'] === 11000) {
    return res.status(StatusCodes.BAD_REQUEST).json({
      msg: `The ${Object.keys(err['keyValue'])} you entered is already exist.`,
    })
  }
  res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ msg: `${err}` })
}

module.exports = errorHandlerMW
