'use strict'

const { verifyAccessToken } = require('../utils/jwt')
const { sendError } = require('../utils/response')
const User = require('../models/User')

/**
 * protect — verifies the JWT in the Authorization header.
 * Attaches req.user = { id, role } on success.
 *
 * Header format:  Authorization: Bearer <token>
 */
async function protect(req, res, next) {
  try {
    const authHeader = req.headers.authorization

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return sendError(res, { statusCode: 401, message: 'No token provided. Please log in.' })
    }

    const token = authHeader.split(' ')[1]
    const decoded = verifyAccessToken(token)

    // Confirm the user still exists and is active
    const user = await User.findById(decoded.id).select('_id role isActive')

    if (!user || !user.isActive) {
      return sendError(res, { statusCode: 401, message: 'User no longer exists or has been deactivated.' })
    }

    req.user = { id: user._id.toString(), role: user.role }
    next()
  } catch (err) {
    if (err.name === 'TokenExpiredError') {
      return sendError(res, { statusCode: 401, message: 'Token expired. Please log in again.' })
    }
    if (err.name === 'JsonWebTokenError') {
      return sendError(res, { statusCode: 401, message: 'Invalid token.' })
    }
    next(err)
  }
}

/**
 * restrictTo — role-based access control.
 * Usage: router.get('/founder-only', protect, restrictTo('founder'), handler)
 */
function restrictTo(...roles) {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return sendError(res, {
        statusCode: 403,
        message: `Access denied. This route is restricted to: ${roles.join(', ')}.`,
      })
    }
    next()
  }
}

module.exports = { protect, restrictTo }
