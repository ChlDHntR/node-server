import * as fs from 'fs'

const mapFunc = (arr, key) => {
  return arr.map((entry) => entry[key])
}

// Form list of definitions
const wordList = (array) => {
  let final = {}
  console.log(array)
  array.forEach((element, index) => {
    let wordString = ''
    element.forEach((elementSon, index) => {
      if (index < element.length - 1) {
        wordString += elementSon.text + ','
      } else {
        wordString += elementSon.text
      }
    })
    final[index] = wordString
  })
  return final
}

function containsKanji(str) {
  return /[\u4E00-\u9FAF]/.test(str)
}

export const runReader = (text) => {
  let index = null
  let kanjiData, allData, answer

  try {
    kanjiData = fs.readFileSync('./src/json/wordDict.json')
    allData = fs.readFileSync('./src/json/jmdict-eng.json')
  } catch (err) {
    console.error(err)
  }

  const kanjiDataObj = JSON.parse(kanjiData)
  const allDataObj = JSON.parse(allData)

  if (containsKanji(text)) {
    for (let i = 0; i <= kanjiDataObj.words.length - 1; i++) {
      if (kanjiDataObj.words[i][0].includes(text)) {
        //console.log(`found ${text} at index ${i}`)
        index = i
        break
      }
    }
  } else {
    for (let i = 0; i <= allDataObj.words.length - 1; i++) {
      if (kanjiDataObj.words[i][1].includes(text)) {
        //console.log(`found ${text} at index ${i}`)
        index = i
        break
      }
    }
  }

  if (!index) {
    return 'no result found'
  }

  let kanaResult = kanjiDataObj.words[index][1]
  let result = allDataObj.words[index].sense
  let ret = result.map((entry) => entry.gloss)

  answer = {
    definition: wordList(ret),
    kanaReading: kanaResult,
  }

  return answer
}

//console.log(runReader('挨拶')) // Example usage
