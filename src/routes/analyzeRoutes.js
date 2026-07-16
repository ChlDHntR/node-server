const express = require('express')
const { analyze } = require('../controllers/analyzeController.js')
const { aiAnalyze } = require('../controllers/aiAnalyzeController.js')

const router = express.Router()

router.post('/analyze', analyze)
router.post('/AIanalyze', aiAnalyze)

module.exports = router
