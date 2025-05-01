import * as fs from 'fs'

let kanjiData, allData, kanaData, answer

try {
  kanjiData = fs.readFileSync('./src/json/MapIndex.json')
  allData = fs.readFileSync('./src/json/meaning.json')
  kanaData = fs.readFileSync('./src/json/kana-only.json')
} catch (err) {
  console.error(err)
}

const kanjiDataObj = JSON.parse(kanjiData)
const allDataObj = JSON.parse(allData)
const kanaDataObj = JSON.parse(kanaData)

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

  if (!kanjiDataObj[text]) {
    return 'no result found'
  }

  index = kanjiDataObj[text][0]

  let kanaResult = kanaDataObj.words[index]
  let ret = allDataObj.words[index]

  answer = {
    definition: wordList(ret),
    kanaReading: kanaResult,
  }

  return answer
}

//console.log(runReader('挨拶')) // Example usage
