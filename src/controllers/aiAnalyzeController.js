const { aiAnalyzeService } = require('../services/aiAnalyzeService.js')

const aiAnalyze = async (req, res, next) => {
  try {
    const text = req.body.content
    if (!text || typeof text !== 'string') {
      return res.status(400).json({ error: 'content is required' })
    }
    const result = await aiAnalyzeService(text)
    res.json(result)
  } catch (err) {
    next(err)
  }
}

module.exports = { aiAnalyze }
