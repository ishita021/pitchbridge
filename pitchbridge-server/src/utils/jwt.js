'use strict'

const jwt = require('jsonwebtoken')
const { jwt: jwtConfig } = require('../config/env')

/**
 * Sign a short-lived access token.
 * Payload: { id, role }
 */
function signAccessToken(payload) {
  return jwt.sign(payload, jwtConfig.secret, {
    expiresIn: jwtConfig.expiresIn,
    issuer: 'pitchbridge',
    audience: 'pitchbridge-client',
  })
}

/**
 * Sign a long-lived refresh token.
 * Payload: { id }
 */
function signRefreshToken(payload) {
  return jwt.sign(payload, jwtConfig.refreshSecret, {
    expiresIn: jwtConfig.refreshExpiresIn,
    issuer: 'pitchbridge',
    audience: 'pitchbridge-client',
  })
}

/**
 * Verify an access token.
 * Returns the decoded payload or throws a JsonWebTokenError.
 */
function verifyAccessToken(token) {
  return jwt.verify(token, jwtConfig.secret, {
    issuer: 'pitchbridge',
    audience: 'pitchbridge-client',
  })
}

/**
 * Verify a refresh token.
 */
function verifyRefreshToken(token) {
  return jwt.verify(token, jwtConfig.refreshSecret, {
    issuer: 'pitchbridge',
    audience: 'pitchbridge-client',
  })
}

module.exports = {
  signAccessToken,
  signRefreshToken,
  verifyAccessToken,
  verifyRefreshToken,
}
