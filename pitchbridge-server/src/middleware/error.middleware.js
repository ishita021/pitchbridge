'use strict'

const { nodeEnv } = require('../config/env')
const { sendError } = require('../utils/response')

/**
 * 404 handler — catches requests to undefined routes.
 */
function notFound(req, res, next) {
  const err = new Error(`Route not found: ${req.method} ${req.originalUrl}`)
  err.statusCode = 404
  next(err)
}

/**
 * Global error handler.
 * Must have 4 parameters for Express to treat it as an error handler.
 */
// eslint-disable-next-line no-unused-vars
function globalErrorHandler(err, req, res, next) {
  let statusCode = err.statusCode || 500
  let message = err.message || 'Internal server error'

  // Mongoose duplicate key (e.g. duplicate email)
  if (err.code === 11000) {
    statusCode = 409
    const field = Object.keys(err.keyValue || {})[0] || 'field'
    message = `An account with this ${field} already exists.`
  }

  // Mongoose validation error
  if (err.name === 'ValidationError') {
    statusCode = 422
    const errors = Object.values(err.errors).map((e) => ({
      field: e.path,
      message: e.message,
    }))
    return sendError(res, { statusCode, message: 'Validation failed', errors })
  }

  // Mongoose cast error (invalid ObjectId)
  if (err.name === 'CastError') {
    statusCode = 400
    message = `Invalid value for field: ${err.path}`
  }

  // In production, hide internal error details
  if (nodeEnv === 'production' && statusCode === 500) {
    message = 'Something went wrong. Please try again later.'
  }

  return sendError(res, {
    statusCode,
    message,
    // Only include stack trace in development
    ...(nodeEnv === 'development' && { errors: err.stack }),
  })
}

module.exports = { notFound, globalErrorHandler }
