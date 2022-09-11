require('dotenv').config();
const mongoose = require('mongoose');
const { isEmail } = require('validator');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Username is required'],
    maxlength: [50, 'Username cannot exceed 50 characters'],
    minlength: [5, 'Username cannot be less than 5 characters'],
  },
  email: {
    type: String,
    required: [true, 'Email address is required'],
    trim: true,
    unique: true,
    index: true,
    validate: [isEmail, '{VALUE} is an invalid email address'],
  },
  password: {
    type: String,
    minlength: 8,
  },
});

UserSchema.pre('save', async function () {
  const salt = await bcrypt.genSalt();
  this.password = await bcrypt.hash(this.password, salt);
});

UserSchema.methods.validatePassword = async function (userPassword) {
  const isValid = await bcrypt.compare(userPassword, this.password);
  return isValid;
};

UserSchema.methods.createJWT = function () {
  const token = jwt.sign(
    { id: this._id, email: this.email },
    process.env.JWT_SECRET_KEY,
    { expiresIn: '1h' }
  );
  return token;
};

const User = mongoose.model('User', UserSchema);

User.createIndexes();

module.exports = User;
