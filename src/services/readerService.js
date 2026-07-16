const fs = require('fs')
const path = require('path')

const jsonDir = path.join(__dirname, '..', 'json')

let indexData, allData, kanaData, kanjiData, monoLangData

try {
  indexData = fs.readFileSync(path.join(jsonDir, 'MapIndex.json'))
  kanjiData = fs.readFileSync(path.join(jsonDir, 'kanjiOnly.json'))
  allData = fs.readFileSync(path.join(jsonDir, 'meaning.json'))
  kanaData = fs.readFileSync(path.join(jsonDir, 'kana-only.json'))
  monoLangData = fs.readFileSync(path.join(jsonDir, 'monolang', 'result', 'map.json'))
} catch (err) {
  console.error(err)
}

const indexDataObj = JSON.parse(indexData)
const allDataObj = JSON.parse(allData)
const kanaDataObj = JSON.parse(kanaData)
const kanjiDataObj = JSON.parse(kanjiData)
const monoLangObj = JSON.parse(monoLangData)

// Form list of definitions
const wordList = (array) => {
  let final = {}
  array.forEach((element, index) => {
    final[index] = element
  })
  return final
}

const runReader = (text) => {
  let array
  /* status avoid sending bad response */
  let status = false

  if (!indexDataObj[text]) {
    array = ['no result found']
  } else {
    status = true
    array = []
    indexDataObj[text].forEach((index) => {
      let kanaResult = kanaDataObj.words[index]
      let ret = allDataObj.words[index]
      let kanjiResult = kanjiDataObj.words[index]

      array.push({
        definition: wordList(ret),
        kanaReading: kanaResult,
        kanjiWriting: kanjiResult,
      })
    })
  }

  let monoLangAns = monoLangObj[text] ? monoLangObj[text] : 'no result found'

  return { answer: array, answer2: monoLangAns, status: status }
}

module.exports = { runReader }
