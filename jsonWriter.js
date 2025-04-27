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
    const kanjiArr = words.map((entry) => {
      let ret = [[], []]
      if (entry.kanji[0]) {
        ret[0] = entry.kanji.map((item) => item.text)
      }
      if (entry.kana[0]) {
        ret[1] = entry.kana.map((item) => item.text)
      }
      return ret
    })

    const kanjiObj = { words: kanjiArr }
    const jsonDat = JSON.stringify(kanjiObj)

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

    fs.writeFile('./src/json/wordDict.json', jsonDat, (err) => {
      if (err) {
        console.error(err)

        return
      }
    })
  })
  console.log('done')
}

runWriter()
