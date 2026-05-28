'use strict'

const mongoose = require('mongoose')
const bcrypt = require('bcryptjs')

const SALT_ROUNDS = 12

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true,
      minlength: [2, 'Name must be at least 2 characters'],
      maxlength: [80, 'Name must be at most 80 characters'],
    },

    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      lowercase: true,
      trim: true,
      match: [/^\S+@\S+\.\S+$/, 'Please enter a valid email address'],
    },

    password: {
      type: String,
      required: [true, 'Password is required'],
      minlength: [8, 'Password must be at least 8 characters'],
      select: false, // never returned in queries by default
    },

    role: {
      type: String,
      enum: {
        values: ['founder', 'investor'],
        message: 'Role must be either "founder" or "investor"',
      },
      required: [true, 'Role is required'],
    },

    // Founder-specific fields
    company: {
      type: String,
      trim: true,
      maxlength: [100, 'Company name must be at most 100 characters'],
    },

    industry: {
      type: String,
      trim: true,
    },

    // Investor-specific fields
    investmentFocus: {
      type: String,
      trim: true,
    },

    // Token management
    refreshToken: {
      type: String,
      select: false,
    },

    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true, // adds createdAt, updatedAt
    toJSON: {
      // Strip sensitive fields when serialising to JSON
      transform(doc, ret) {
        delete ret.password
        delete ret.refreshToken
        delete ret.__v
        return ret
      },
    },
  }
)

// ── Indexes ───────────────────────────────────────────────────────────────────
// NOTE: email already has an index from unique:true in the field definition.
// Only add the role index here to avoid the duplicate-index warning.
userSchema.index({ role: 1 })

// ── Pre-save hook: hash password ──────────────────────────────────────────────
userSchema.pre('save', async function (next) {
  // Only hash when password field is new or modified
  if (!this.isModified('password')) return next()

  try {
    this.password = await bcrypt.hash(this.password, SALT_ROUNDS)
    next()
  } catch (err) {
    next(err)
  }
})

// ── Instance method: compare password ────────────────────────────────────────
userSchema.methods.comparePassword = async function (candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password)
}

// ── Static method: find by email (includes password for auth) ─────────────────
userSchema.statics.findByEmailWithPassword = function (email) {
  return this.findOne({ email: email.toLowerCase() }).select('+password +refreshToken')
}

const User = mongoose.model('User', userSchema)

module.exports = User
