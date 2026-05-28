'use strict'

const mongoose = require('mongoose')

const teamMemberSchema = new mongoose.Schema({
  name: { type: String, trim: true },
  role: { type: String, trim: true },
})

const pitchSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Pitch title is required'],
      trim: true,
      maxlength: [140, 'Pitch title must be at most 140 characters'],
    },
    company: {
      type: String,
      required: [true, 'Company name is required'],
      trim: true,
      maxlength: [100, 'Company name must be at most 100 characters'],
    },
    website: {
      type: String,
      trim: true,
    },
    industry: {
      type: String,
      required: [true, 'Industry is required'],
      trim: true,
    },
    stage: {
      type: String,
      required: [true, 'Funding stage is required'],
      trim: true,
    },
    funding: {
      type: String,
      trim: true,
    },
    summary: {
      type: String,
      trim: true,
    },
    problem: {
      type: String,
      trim: true,
    },
    solution: {
      type: String,
      trim: true,
    },
    market: {
      type: String,
      trim: true,
    },
    businessModel: {
      type: String,
      trim: true,
    },
    traction: {
      type: String,
      trim: true,
    },
    teamMembers: [teamMemberSchema],
    attachments: [{ type: String, trim: true }],
    status: {
      type: String,
      enum: ['Active', 'Draft', 'Published'],
      default: 'Active',
    },
    views: {
      type: Number,
      default: 0,
    },
    interests: {
      type: Number,
      default: 0,
    },
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Pitch author is required'],
    },
  },
  {
    timestamps: true,
    toJSON: {
      transform(doc, ret) {
        delete ret.__v
        return ret
      },
    },
  }
)

pitchSchema.index({ title: 'text', company: 'text', summary: 'text', problem: 'text', solution: 'text' })

const Pitch = mongoose.model('Pitch', pitchSchema)
module.exports = Pitch
