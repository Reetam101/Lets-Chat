const jwt = require('jsonwebtoken')
const User = require('../models/User')
const asyncHandler = require('express-async-handler')

const protect = asyncHandler(async (req, res, next) => {
  let token

  if(req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      token = req.headers.authorization.split(' ')[1];

      // decode the token
      const decoded_token = jwt.verify(token, process.env.JWT_SECRET)
      req.user = await User.findById(decoded_token.id).select("-password")

      next()
    } catch(error) {
      res.status(401)
      throw new Error("Not authorized, token invalid!")
    }
  }

  if(!token) {
    res.status(401)
    throw new Error("Not authorized, token is missing!")
  }
})

module.exports = { protect }