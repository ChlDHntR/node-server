const Anthropic = require('@anthropic-ai/sdk')

// Resolves ANTHROPIC_API_KEY from the environment automatically.
const client = new Anthropic()

const MODEL = 'claude-sonnet-5'

const SYSTEM_PROMPT = [
  'Translate Japanese text into natural Vietnamese and give a concise word-by-word',
  'breakdown for a Vietnamese learner. Skip pure punctuation.',
  'The text may contain inline furigana (kana pasted right after each kanji, no',
  'parentheses): e.g. "三み島しまと太だ宰ざい" means "三島と太宰" with readings',
  'みしま and だざい. Strip that kana to recover the real words, and never let it',
  'leak into the translation.'
].join(' ')

// Structured-output schema so the response is always valid, parseable JSON.
const RESPONSE_FORMAT = {
  type: 'json_schema',
  schema: {
    type: 'object',
    properties: {
      translation: {
        type: 'string',
        description: 'Natural Vietnamese translation of the whole text.'
      },
      words: {
        type: 'array',
        description: 'Word-by-word breakdown of the Japanese text.',
        items: {
          type: 'object',
          properties: {
            surface: { type: 'string', description: 'Word as it appears in the text.' },
            reading: { type: 'string', description: 'Reading in hiragana.' },
            meaning: { type: 'string', description: 'Short Vietnamese meaning.' }
          },
          required: ['surface', 'reading', 'meaning'],
          additionalProperties: false
        }
      }
    },
    required: ['translation', 'words'],
    additionalProperties: false
  }
}

/**
 * Analyze Japanese text with Claude: produce a Vietnamese translation plus a
 * word-by-word breakdown.
 *
 * @param {string} text Japanese text to analyze.
 * @returns {Promise<{ translation: string, words: Array<{ surface: string, reading: string, meaning: string }> }>}
 */
const aiAnalyzeService = async (text) => {
  const response = await client.messages.create({
    model: MODEL,
    max_tokens: 16000,
    thinking: { type: 'adaptive' },
    system: SYSTEM_PROMPT,
    output_config: { format: RESPONSE_FORMAT },
    messages: [{ role: 'user', content: text }]
  })

  const textBlock = response.content.find((block) => block.type === 'text')
  if (!textBlock) {
    throw new Error('Claude returned no text content')
  }

  return JSON.parse(textBlock.text)
}

module.exports = { aiAnalyzeService }
