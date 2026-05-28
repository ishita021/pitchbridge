'use strict'

const mongoose = require('mongoose')
const { mongoUri, nodeEnv } = require('./env')

/**
 * Connect to MongoDB.
 * Exits the process on failure so the server never starts in a broken state.
 */
async function connectDB() {
  try {
    const conn = await mongoose.connect(mongoUri, {
      // Mongoose 8 no longer needs useNewUrlParser / useUnifiedTopology
    })

    console.log(`✅  MongoDB connected: ${conn.connection.host}`)

    mongoose.connection.on('disconnected', () => {
      console.warn('⚠️   MongoDB disconnected')
    })

    mongoose.connection.on('error', (err) => {
      console.error('❌  MongoDB error:', err.message)
    })
  } catch (err) {
    console.error('❌  MongoDB connection failed:', err.message)
    process.exit(1)
  }
}

module.exports = connectDB
