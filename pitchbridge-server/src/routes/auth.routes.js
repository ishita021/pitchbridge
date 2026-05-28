'use strict'

const { Router } = require('express')
const { body } = require('express-validator')
const { signup, login, refresh, logout, getMe } = require('../controllers/auth.controller')
const { protect } = require('../middleware/auth.middleware')

const router = Router()

// ── Validation rule sets ──────────────────────────────────────────────────────

const signupRules = [
  body('name')
    .trim()
    .notEmpty().withMessage('Name is required')
    .isLength({ min: 2, max: 80 }).withMessage('Name must be 2–80 characters'),

  body('email')
    .trim()
    .notEmpty().withMessage('Email is required')
    .isEmail().withMessage('Enter a valid email address')
    .normalizeEmail(),

  body('password')
    .notEmpty().withMessage('Password is required')
    .isLength({ min: 8 }).withMessage('Password must be at least 8 characters')
    .matches(/[A-Z]/).withMessage('Password must contain at least one uppercase letter')
    .matches(/[0-9]/).withMessage('Password must contain at least one number'),

  body('role')
    .notEmpty().withMessage('Role is required')
    .isIn(['founder', 'investor']).withMessage('Role must be "founder" or "investor"'),

  // Founder-only fields
  body('company')
    .if(body('role').equals('founder'))
    .trim()
    .notEmpty().withMessage('Company name is required for founders')
    .isLength({ max: 100 }).withMessage('Company name must be at most 100 characters'),

  body('industry')
    .if(body('role').equals('founder'))
    .trim()
    .notEmpty().withMessage('Industry is required for founders'),

  // Investor-only fields
  body('investmentFocus')
    .if(body('role').equals('investor'))
    .trim()
    .notEmpty().withMessage('Investment focus is required for investors'),
]

const loginRules = [
  body('email')
    .trim()
    .notEmpty().withMessage('Email is required')
    .isEmail().withMessage('Enter a valid email address')
    .normalizeEmail(),

  body('password')
    .notEmpty().withMessage('Password is required'),
]

const refreshRules = [
  body('refreshToken')
    .notEmpty().withMessage('Refresh token is required'),
]

// ── Routes ────────────────────────────────────────────────────────────────────

// Public
router.post('/signup',  signupRules,  signup)
router.post('/login',   loginRules,   login)
router.post('/refresh', refreshRules, refresh)

// Protected (requires valid access token)
router.post('/logout', protect, logout)
router.get('/me',      protect, getMe)

module.exports = router
