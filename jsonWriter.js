import * as fs from 'fs'

const runWriter = () => {
  fs.readFile('./src/json/jmdict-eng.json', (err, dat) => {
    if (err) {
      console.log('error reading')
      return
    }
    const obj = JSON.parse(dat)
    const words = obj.words
    //Write kanji only json

    const keyMap = {}

    words.forEach((entry, index) => {
      if (entry.kanji[0]) {
        entry.kanji.forEach((item) => {
          if (keyMap[item.text]) {
            keyMap[item.text].push(index)
          } else {
            keyMap[item.text] = [index]
          }
        })
      }
      if (entry.kana[0]) {
        entry.kana.forEach((item) => {
          if (keyMap[item.text]) {
            keyMap[item.text].push(index)
          } else {
            keyMap[item.text] = [index]
          }
        })
      }
    })

    const jsonDat = JSON.stringify(keyMap)

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

    fs.writeFile('./src/json/MapIndex.json', jsonDat, (err) => {
      if (err) {
        console.error(err)

        return
      }
    })
  })
  console.log('done')
}

runWriter()
