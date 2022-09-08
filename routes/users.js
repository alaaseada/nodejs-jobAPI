const express = require('express');
const router = express.Router();
const {
  getAllUsers,
  getUser,
  register,
  login,
  deleteUser,
  changePassword,
} = require('../controllers/users');

router.get('/', getAllUsers);
router.route('/:id').get(getUser).delete(deleteUser);
router.post('/register', register);
router.post('/login', login);
router.patch('/changePassword', changePassword);
module.exports = router;
