'use strict'

/**
 * Standardised JSON response helpers.
 * Every API response follows the same shape:
 *   { success, message, data? }
 */

function sendSuccess(res, { statusCode = 200, message = 'OK', data = undefined } = {}) {
  const body = { success: true, message }
  if (data !== undefined) body.data = data
  return res.status(statusCode).json(body)
}

function sendError(res, { statusCode = 500, message = 'Internal server error', errors = undefined } = {}) {
  const body = { success: false, message }
  if (errors !== undefined) body.errors = errors
  return res.status(statusCode).json(body)
}

module.exports = { sendSuccess, sendError }
