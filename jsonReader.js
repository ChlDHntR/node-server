import * as fs from 'fs'

let indexData, allData, kanaData, kanjiData

try {
  indexData = fs.readFileSync('./src/json/MapIndex.json')
  kanjiData = fs.readFileSync('./src/json/kanjiOnly.json')
  allData = fs.readFileSync('./src/json/meaning.json')
  kanaData = fs.readFileSync('./src/json/kana-only.json')
} catch (err) {
  console.error(err)
}


const indexDataObj = JSON.parse(indexData)
const allDataObj = JSON.parse(allData)
const kanaDataObj = JSON.parse(kanaData)
const kanjiDataObj = JSON.parse(kanjiData)


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
  let index = null
  let array = []
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

  if (!indexDataObj[text]) {
    return 'no result found'
  }

  indexDataObj[text].forEach((index) => {
    let kanaResult = kanaDataObj.words[index]
    let ret = allDataObj.words[index]
    let kanjiResult = kanjiDataObj.words[index]

    array.push({
      definition: wordList(ret),
      kanaReading: kanaResult,
      kanjiWriting: kanjiResult
    })
  })

  return { answer: array }
}

//console.log(runReader('ぎそう')) // Example usage
