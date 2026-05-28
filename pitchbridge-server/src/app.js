'use strict'

// Load and validate env vars first — before anything else imports them
const env = require('./config/env')

const express = require('express')
const helmet = require('helmet')
const cors = require('cors')
const morgan = require('morgan')
const rateLimit = require('express-rate-limit')

const connectDB = require('./config/db')
const routes = require('./routes/index')
const { notFound, globalErrorHandler } = require('./middleware/error.middleware')

// ── App instance ──────────────────────────────────────────────────────────────
const app = express()

// ── Security headers ──────────────────────────────────────────────────────────
app.use(helmet())

// ── CORS ──────────────────────────────────────────────────────────────────────
app.use(
  cors({
    origin: env.clientUrl,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
  })
)

// ── Request logging (dev only) ────────────────────────────────────────────────
if (env.nodeEnv === 'development') {
  app.use(morgan('dev'))
}

// ── Body parsers ──────────────────────────────────────────────────────────────
app.use(express.json({ limit: '10kb' }))
app.use(express.urlencoded({ extended: true, limit: '10kb' }))

// ── Global rate limiter ───────────────────────────────────────────────────────
// Stricter limiter specifically for auth endpoints
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 20,                   // max 20 auth requests per window per IP
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: 'Too many requests from this IP. Please try again after 15 minutes.',
  },
})

app.use('/api/auth', authLimiter)

// General API limiter
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 200,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: 'Too many requests. Please slow down.',
  },
})

app.use('/api', apiLimiter)

// ── Health check ──────────────────────────────────────────────────────────────
app.get('/health', (req, res) => {
  res.json({
    success: true,
    message: 'PitchBridge API is running',
    environment: env.nodeEnv,
    timestamp: new Date().toISOString(),
  })
})

// ── API routes ────────────────────────────────────────────────────────────────
app.use('/api', routes)

// ── Error handling ────────────────────────────────────────────────────────────
app.use(notFound)
app.use(globalErrorHandler)

// ── Start server ──────────────────────────────────────────────────────────────
async function start() {
  await connectDB()

  app.listen(env.port, () => {
    console.log(`🚀  Server running in ${env.nodeEnv} mode on http://localhost:${env.port}`)
    console.log(`📡  API base: http://localhost:${env.port}/api`)
    console.log(`❤️   Health:  http://localhost:${env.port}/health`)
  })
}

start()

module.exports = app // exported for testing
