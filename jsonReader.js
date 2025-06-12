const fs = require('fs')
const kuromoji = require('kuromoji')

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

const runReader = async (text) => {
    let monoLangAns = 'no result found'
    let array

    //Return result from searching json dict
    const getResult = async (text) => {
      let res = null
      try {
        res = await text()
        return 'huh'
      } catch (e) {
        console.log(e)
      } finally {
        if (!indexDataObj[res]) {
          return 'no result found'
        }
        
        let returnArray
        
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
        
        return { answer: res, answer2: monoLangAns }
      }
      
    }

    kuromoji
      .builder({ dicPath: './src/json/dict' })
      .build(function (err, tokenizer) {
        // tokenizer is ready

        array = getResult(() => tokenizer.tokenize('待っている'))
      })

  // if (!indexDataObj[text]) {
  //   array = 'no result found'
  //   kuromoji
  //     .builder({ dicPath: './src/json/dict' })
  //     .build(function (err, tokenizer) {
  //       // tokenizer is ready

  //       array = getResult(() => tokenizer.tokenize('待っている'))
  //     })
  // } else {
  //   return
  //   //array = getResult(text)
  // }

  // monoLangAns = monoLangObj[text] ? monoLangObj[text] : 'no result found'
  //return { answer: array, answer2: monoLangAns }
}

console.log(runReader('待って')) // Example usage

module.exports = { runReader }
