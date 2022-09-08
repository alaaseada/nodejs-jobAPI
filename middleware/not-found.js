const { StatusCodes } = require('http-status-codes');

const notFound = (req, res, next) =>
  res
    .status(StatusCodes.NOT_FOUND)
    .json({ msg: 'The route you attempt to access is not found' });

module.exports = notFound;
