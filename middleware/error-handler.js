const CustomAPIError = require('../errors/custom-error');
const { StatusCodes } = require('http-status-codes');

const errorHandlerMW = async (err, req, res, next) => {
  if (err instanceof CustomAPIError)
    return res.status(err.statusCode).json({ msg: err.message });
  res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ msg: `${err}` });
};

module.exports = errorHandlerMW;
