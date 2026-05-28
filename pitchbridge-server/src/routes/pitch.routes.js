'use strict'

const { Router } = require('express')
const { body } = require('express-validator')
const { protect, restrictTo } = require('../middleware/auth.middleware')
const { createPitch, getAllPitches, getMyPitches, getPitchById } = require('../controllers/pitch.controller')

const router = Router()

const pitchValidation = [
  body('title').trim().notEmpty().withMessage('Pitch title is required'),
  body('company').trim().notEmpty().withMessage('Company name is required'),
  body('industry').trim().notEmpty().withMessage('Industry is required'),
  body('stage').trim().notEmpty().withMessage('Funding stage is required'),
  body('summary').trim().notEmpty().withMessage('Executive summary is required'),
  body('problem').trim().notEmpty().withMessage('Problem statement is required'),
  body('solution').trim().notEmpty().withMessage('Solution is required'),
  body('market').trim().notEmpty().withMessage('Market opportunity is required'),
  body('businessModel').trim().notEmpty().withMessage('Business model is required'),
]

router.post('/', protect, restrictTo('founder'), pitchValidation, createPitch)
router.get('/me', protect, restrictTo('founder'), getMyPitches)
router.get('/:id', getPitchById)
router.get('/', getAllPitches)

module.exports = router
