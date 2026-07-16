const { tokenize } = require('kuromojin')
const { runReader } = require('./readerService.js')

/**
 * Analyze a piece of Japanese text.
 * First tries the reader directly; if there's no direct hit it tokenizes
 * the text and runs the reader against each token's basic form.
 *
 * @param {string} text
 * @returns {Promise<{ analyze: Array, runReader: Array }>}
 */
const analyzeText = async (text) => {
  const ret = { analyze: [], runReader: [] }
  const test = runReader(text)

  // Direct hit — no need to tokenize.
  if (test.status) {
    ret.runReader.push(test)
    ret.analyze.push({ basic_form: '', surface_form: text })
    return ret
  }

  try {
    const token = await tokenize(text)
    ret.analyze = token.map(({ surface_form, basic_form }) => {
      ret.runReader.push(runReader(basic_form))
      return { surface_form, basic_form }
    })
  } catch (err) {
    // Tokenize failed — fall back to the direct (empty) result.
    ret.runReader.push(test)
    ret.analyze.push({ basic_form: '', surface_form: text })
  }

  return ret
}

module.exports = { analyzeText }
