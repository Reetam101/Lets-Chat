const express = require('express')
const { registerUser, authUser, allUsers } = require('../controllers/userControllers')
const { protect } = require('../middleware/authMiddleware')
const router = express.Router()

router.route('/').post(registerUser).get(protect, allUsers)
router.route('/login').post(authUser)

module.exports = router