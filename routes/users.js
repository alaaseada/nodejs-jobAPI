const express = require('express')
const router = express.Router()
const {
  getAllUsers,
  getUser,
  register,
  login,
  deleteUser,
  resetPassword,
  sendAnEmail,
} = require('../controllers/users')

router.get('/', getAllUsers)
router.route('/:id').get(getUser).delete(deleteUser)
router.post('/send-email', sendAnEmail)
router.post('/register', register)
router.post('/login', login)
router.patch('/reset-password', resetPassword)
module.exports = router
