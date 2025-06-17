// import axios from 'axios'

// const run = async () => {
//   const response = await axios.get('https://drive.google.com/uc?export=download&id=1eCgpywTXmWx99mfR-taxn1iXJ0jCUVj5')
//   console.log(response)
// }

// run()

const fs = require('fs')
const kuromoji = require('kuromojiFORK')

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

const mapFunc = (arr, key) => {
  return arr.map((entry) => entry[key])
}

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

const runReader = (text) => {
    let monoLangAns = 'no result found'
    //Return result from searching json dict

    let returnArray

    if (!indexDataObj[text]) {
      return 'no result found'
    }

    indexDataObj[text].forEach((index) => {
      let kanaResult = kanaDataObj.words[index]
      let ret = allDataObj.words[index]
      let kanjiResult = kanjiDataObj.words[index]
      returnArray = []

      returnArray.push({
        definition: wordList(ret),
        kanaReading: kanaResult,
        kanjiWriting: kanjiResult,
      })
    })

    return { answer: returnArray, answer2: monoLangAns }
}

//runReader('待って').then((token) => console.log(token)) // Example usage

const runAnalyzer = (text) => {
  let tokenValue
  kuromoji.builder({ dicPath: './src/json/dict' }).build(function (err, tokenizer) {
    // tokenizer is ready
    var path = tokenizer.tokenize(text, (token) => {

      tokenValue = runReader(token[0].basic_form)
      
    })
  })
}

console.log(runAnalyzer('実家にいたいおえあ'))