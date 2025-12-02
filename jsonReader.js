const fs = require('fs')
//const kuromoji = require('kuromojiFORK')

let indexData, allData, kanaData, kanjiData, monoLangData

try {
  indexData = fs.readFileSync('./src/json/MapIndex.json')
  kanjiData = fs.readFileSync('./src/json/kanjiOnly.json')
  allData = fs.readFileSync('./src/json/meaning.json')
  kanaData = fs.readFileSync('./src/json/kana-only.json')
  monoLangData = fs.readFileSync('./src/json/monolang/result/map.json')
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

// function containsKanji(str) {
//   return /[\u4E00-\u9FAF]/.test(str)
// }

// const runAnalyzer = (text, method) => {
//   let tokenValue
//   kuromoji
//     .builder({ dicPath: './src/json/dict' })
//     .build(function (err, tokenizer) {
//       // tokenizer is ready
//       var path = tokenizer.tokenize(text, (token) => {
//         method(token)
//       })
//     })
// }

const runReader = (text) => {
  let array
  /* status avoid sending bad response */
  let status = false

  if (!indexDataObj[text]) {
    array = ['no result found']
    //array = []
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

//console.log(runReader('たい')) // Example usage

module.exports = { runReader }
