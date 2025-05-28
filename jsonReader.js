import * as fs from 'fs'

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

function containsKanji(str) {
  return /[\u4E00-\u9FAF]/.test(str)
}

export const runReader = (text) => {
  let monoLangAns = 'no result found'
  let array
  // if (containsKanji(text)) {
  //   for (let i = 0; i <= kanjiDataObj.words.length - 1; i++) {
  //     if (kanjiDataObj.words[i][0].includes(text)) {
  //       //console.log(`found ${text} at index ${i}`)
  //       index = i
  //       break
  //     }
  //   }
  // } else {
  //   for (let i = 0; i <= allDataObj.words.length - 1; i++) {
  //     if (kanjiDataObj.words[i][1].includes(text)) {
  //       //console.log(`found ${text} at index ${i}`)
  //       index = i
  //       break
  //     }
  //   }
  // }

  // if (!indexDataObj[text] && !monoLangObj[text]) {
  //   return 'no result found'
  // }

  if (!indexDataObj[text]) {
    array = 'no result found'
  } else {
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

  monoLangAns = monoLangObj[text] ? monoLangObj[text] : 'no result found'

  return { answer: array, answer2: monoLangAns }
}

console.log(runReader('ぎひょう')) // Example usage
