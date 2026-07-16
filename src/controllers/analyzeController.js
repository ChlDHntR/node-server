const { analyzeText } = require('../services/analyzeService.js')

const analyze = async (req, res, next) => {
  try {
    const text = req.body.content
    const result = await analyzeText(text)
    res.json(result)
  } catch (err) {
    next(err)
  }
}

module.exports = { analyze }
