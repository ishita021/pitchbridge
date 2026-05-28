'use strict'

const { Router } = require('express')
const authRoutes = require('./auth.routes')
const pitchRoutes = require('./pitch.routes')

const router = Router()

// Mount route groups — easy to add more (pitches, users, etc.) later
router.use('/auth', authRoutes)
router.use('/pitches', pitchRoutes)

module.exports = router
