'use strict'

const { validationResult } = require('express-validator')
const Pitch = require('../models/Pitch')
const { sendSuccess, sendError } = require('../utils/response')

async function createPitch(req, res, next) {
  try {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return sendError(res, {
        statusCode: 422,
        message: 'Validation failed',
        errors: errors.array().map((e) => ({ field: e.path, message: e.msg })),
      })
    }

    const {
      title,
      company,
      website,
      industry,
      stage,
      funding,
      summary,
      problem,
      solution,
      market,
      businessModel,
      traction,
      teamMembers,
      attachments,
    } = req.body

    const pitch = await Pitch.create({
      title,
      company,
      website,
      industry,
      stage,
      funding,
      summary,
      problem,
      solution,
      market,
      businessModel,
      traction,
      teamMembers: Array.isArray(teamMembers) ? teamMembers : [],
      attachments: Array.isArray(attachments) ? attachments : [],
      author: req.user.id,
    })

    return sendSuccess(res, {
      statusCode: 201,
      message: 'Pitch created successfully.',
      data: { pitch },
    })
  } catch (err) {
    next(err)
  }
}

async function getAllPitches(req, res, next) {
  try {
    const pitches = await Pitch.find({ status: 'Active' })
      .sort({ createdAt: -1 })
      .populate('author', 'name company email')

    return sendSuccess(res, {
      data: { pitches },
    })
  } catch (err) {
    next(err)
  }
}

async function getMyPitches(req, res, next) {
  try {
    const pitches = await Pitch.find({ author: req.user.id })
      .sort({ createdAt: -1 })
      .populate('author', 'name company email')

    return sendSuccess(res, {
      data: { pitches },
    })
  } catch (err) {
    next(err)
  }
}

async function getPitchById(req, res, next) {
  try {
    const pitch = await Pitch.findById(req.params.id).populate('author', 'name company email')

    if (!pitch) {
      return sendError(res, { statusCode: 404, message: 'Pitch not found.' })
    }

    return sendSuccess(res, {
      data: { pitch },
    })
  } catch (err) {
    next(err)
  }
}

async function savePitch(req, res, next) {
  try {
    const pitch = await Pitch.findById(req.params.id)
    if (!pitch) {
      return sendError(res, { statusCode: 404, message: 'Pitch not found.' })
    }

    const userId = req.user.id
    const alreadySaved = pitch.savedBy.includes(userId)
    if (alreadySaved) {
      pitch.savedBy = pitch.savedBy.filter((id) => id.toString() !== userId)
    } else {
      pitch.savedBy.push(userId)
    }

    await pitch.save()
    return sendSuccess(res, {
      data: { pitch, saved: !alreadySaved },
    })
  } catch (err) {
    next(err)
  }
}

async function recordView(req, res, next) {
  try {
    const pitch = await Pitch.findById(req.params.id)
    if (!pitch) {
      return sendError(res, { statusCode: 404, message: 'Pitch not found.' })
    }

    const userId = req.user.id
    if (!pitch.viewedBy.includes(userId)) {
      pitch.viewedBy.push(userId)
      await pitch.save()
    }

    return sendSuccess(res, {
      data: { pitch },
    })
  } catch (err) {
    next(err)
  }
}

async function getSavedPitches(req, res, next) {
  try {
    const pitches = await Pitch.find({ savedBy: req.user.id })
      .sort({ createdAt: -1 })
      .populate('author', 'name company email')

    return sendSuccess(res, {
      data: { pitches },
    })
  } catch (err) {
    next(err)
  }
}

async function getViewedPitches(req, res, next) {
  try {
    const limit = parseInt(req.query.limit, 10) || 10
    const pitches = await Pitch.find({ viewedBy: req.user.id })
      .sort({ updatedAt: -1 })
      .limit(limit)
      .populate('author', 'name company email')

    return sendSuccess(res, {
      data: { pitches },
    })
  } catch (err) {
    next(err)
  }
}

module.exports = { createPitch, getAllPitches, getMyPitches, getPitchById, savePitch, recordView, getSavedPitches, getViewedPitches }
