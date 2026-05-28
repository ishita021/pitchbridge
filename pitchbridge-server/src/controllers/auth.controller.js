'use strict'

const { validationResult } = require('express-validator')
const User = require('../models/User')
const { signAccessToken, signRefreshToken, verifyRefreshToken } = require('../utils/jwt')
const { sendSuccess, sendError } = require('../utils/response')

// ── Helpers ───────────────────────────────────────────────────────────────────

/**
 * Build the token pair and persist the refresh token WITHOUT triggering
 * the pre-save password-hash hook (which would re-hash an already-hashed password).
 * We use findByIdAndUpdate so the pre-save hook is never called.
 */
async function issueTokens(user) {
  const payload = { id: user._id.toString(), role: user.role }
  const accessToken = signAccessToken(payload)
  const refreshToken = signRefreshToken({ id: user._id.toString() })

  // Use updateOne to bypass the pre-save hook entirely
  await User.updateOne({ _id: user._id }, { refreshToken })

  return { accessToken, refreshToken }
}

// ── Controllers ───────────────────────────────────────────────────────────────

/**
 * POST /api/auth/signup
 * Register a new founder or investor.
 */
async function signup(req, res, next) {
  try {
    // 1. Validate request body
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return sendError(res, {
        statusCode: 422,
        message: 'Validation failed',
        errors: errors.array().map((e) => ({ field: e.path, message: e.msg })),
      })
    }

    const { name, email, password, role, company, industry, investmentFocus } = req.body

    // 2. Check for duplicate email
    const existing = await User.findOne({ email: email.toLowerCase() })
    if (existing) {
      return sendError(res, { statusCode: 409, message: 'An account with this email already exists.' })
    }

    // 3. Build user document
    const userData = { name, email, password, role }
    if (role === 'founder') {
      userData.company = company
      userData.industry = industry
    } else {
      userData.investmentFocus = investmentFocus
    }

    const user = await User.create(userData)

    // 4. Issue tokens
    const { accessToken, refreshToken } = await issueTokens(user)

    // 5. Respond — never send the password back
    return sendSuccess(res, {
      statusCode: 201,
      message: 'Account created successfully.',
      data: {
        user: user.toJSON(),
        accessToken,
        refreshToken,
      },
    })
  } catch (err) {
    next(err)
  }
}

/**
 * POST /api/auth/login
 * Authenticate an existing user.
 */
async function login(req, res, next) {
  try {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return sendError(res, {
        statusCode: 422,
        message: 'Validation failed',
        errors: errors.array().map((e) => ({ field: e.path, message: e.msg })),
      })
    }

    const { email, password } = req.body

    // Fetch user with password field (normally excluded)
    const user = await User.findByEmailWithPassword(email)
    if (!user || !user.isActive) {
      return sendError(res, { statusCode: 401, message: 'Invalid email or password.' })
    }

    const isMatch = await user.comparePassword(password)
    if (!isMatch) {
      return sendError(res, { statusCode: 401, message: 'Invalid email or password.' })
    }

    const { accessToken, refreshToken } = await issueTokens(user)

    return sendSuccess(res, {
      message: 'Logged in successfully.',
      data: {
        user: user.toJSON(),
        accessToken,
        refreshToken,
      },
    })
  } catch (err) {
    next(err)
  }
}

/**
 * POST /api/auth/refresh
 * Issue a new access token using a valid refresh token.
 */
async function refresh(req, res, next) {
  try {
    const { refreshToken } = req.body
    if (!refreshToken) {
      return sendError(res, { statusCode: 400, message: 'Refresh token is required.' })
    }

    // Verify the refresh token signature
    let decoded
    try {
      decoded = verifyRefreshToken(refreshToken)
    } catch {
      return sendError(res, { statusCode: 401, message: 'Invalid or expired refresh token.' })
    }

    // Confirm the token matches what we stored
    const user = await User.findById(decoded.id).select('+refreshToken')
    if (!user || user.refreshToken !== refreshToken || !user.isActive) {
      return sendError(res, { statusCode: 401, message: 'Refresh token is no longer valid. Please log in again.' })
    }

    // Issue a fresh pair
    const { accessToken, refreshToken: newRefreshToken } = await issueTokens(user)

    return sendSuccess(res, {
      message: 'Token refreshed.',
      data: { accessToken, refreshToken: newRefreshToken },
    })
  } catch (err) {
    next(err)
  }
}

/**
 * POST /api/auth/logout
 * Invalidate the refresh token stored on the user.
 */
async function logout(req, res, next) {
  try {
    // req.user is set by the protect middleware
    await User.findByIdAndUpdate(req.user.id, { refreshToken: null })

    return sendSuccess(res, { message: 'Logged out successfully.' })
  } catch (err) {
    next(err)
  }
}

/**
 * GET /api/auth/me
 * Return the currently authenticated user's profile.
 */
async function getMe(req, res, next) {
  try {
    const user = await User.findById(req.user.id)
    if (!user) {
      return sendError(res, { statusCode: 404, message: 'User not found.' })
    }

    return sendSuccess(res, { data: { user } })
  } catch (err) {
    next(err)
  }
}

module.exports = { signup, login, refresh, logout, getMe }
