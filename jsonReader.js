import * as fs from 'fs'

const mapFunc = (arr, key) => {
  return arr.map((entry) => entry[key])
}

const wordList = (array) => {
  let final = {}
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

const runWriter = () => {
  fs.readFile('./src/json/jmdict-eng.json', (err, dat) => {
    if (err) {
      console.log('error reading')
      return
    }
    const obj = JSON.parse(dat)
    const words = obj.words

    //Write kanji only json
    // const kanjiArr = obj.words.map(entry => {
    //     if (!entry.kanji[0]) {
    //         return []
    //     }
    //     return entry.kanji.map(item => item.text)
    // })
    // const kanjiObj = { words: kanjiArr }
    // const jsonDat = JSON.stringify(kanjiObj)

    //Write only first 200 entry
    // let retArr = []
    // for (let i=0; i<=199; i++) {
    //     retArr[i] = words[i]
    // }
    // const jsonDat = JSON.stringify({words: retArr})

    //write definition
    // const retArr = words.map(entry => {
    //     if (!entry.sense[0]) {
    //         return []
    //     }
    //     return mapFunc(entry.sense, 'gloss')
    // })
    // const jsonDat = JSON.stringify({words: retArr})

    fs.writeFile('./src/json/blank.json', jsonDat, (err) => {
      if (err) {
        console.error(err)

        return
      }
    })
  })
}

export const runReader = (text) => {
  let index = null
  let kanjiData, allData, answer

  try {
    kanjiData = fs.readFileSync('./src/json/kanji-only.json')
    allData = fs.readFileSync('./src/json/jmdict-eng.json')
  } catch (err) {
    console.error(err)
  }

  const kanjiDataObj = JSON.parse(kanjiData)
  const allDataObj = JSON.parse(allData)

  for (let i = 0; i <= kanjiDataObj.words.length - 1; i++) {
    if (kanjiDataObj.words[i].includes(text)) {
      //console.log(`found ${text} at index ${i}`)
      index = i
      break
    }
  }

  if (!index) {
    console.log('no result found')
    return
  }

  let result = allDataObj.words[index].sense
  let ret = result.map((entry) => entry.gloss)

  answer = wordList(ret)

  return answer
}
