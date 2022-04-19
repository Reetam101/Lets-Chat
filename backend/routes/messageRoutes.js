const express = require('express')
const { sendMessage, getAllMessages } = require('../controllers/messageControllers')
const { protect } = require('../middleware/authMiddleware')
const router = express.Router()

router.route('/').post(protect, sendMessage)
router.route('/:chatId').get(protect, getAllMessages)

module.exports = router