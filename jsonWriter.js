import * as fs from 'fs'

const runWriter = () => {
  fs.readFile('./src/json/jmdict-eng.json', (err, dat) => {
    if (err) {
      console.log('error reading')
      return
    }
    const obj = JSON.parse(dat)
    const words = obj.words
    const meaningArr = { words: [] }
    //Write kanji only json
    words.forEach((element, index) => {
      let kanjiArr = []
      element.kanji.forEach((childElement) => {
        if (index === 20000) {
          console.log(childElement)
        }
        kanjiArr.push(childElement.text)
      })
      meaningArr.words.push(kanjiArr)
    });




    //const keyMap = {}

    // write kanji/kana file map
    // words.forEach((entry, index) => {
    //   if (entry.kana[0]) {
    //     let kanaString = ''
    //     entry.kana.forEach((item, index) => {
    //       if (index < entry.kana.length - 1) {
    //         kanaString += item.text + ', '
    //       } else {
    //         kanaString += item.text
    //       }
    //     })
    //     meaningArr.words[index] = kanaString
    //   }
    // })

    // write meaning file
    // words.forEach((entry, index) => {
    //   if (entry.sense[0]) {
    //     if (meaningArr.words[index] === undefined) {
    //       meaningArr.words[index] = []
    //     }
    //     //gloss
    //     entry.sense.forEach((item, index2) => {
    //       let wordString = ''
    //       item.gloss.forEach((element, index3) => {
    //         if (index3 < item.gloss.length - 1) {
    //           wordString += element.text + ' ,'
    //         } else {
    //           wordString += element.text
    //         }
    //       })
    //       meaningArr.words[index].push(wordString)
    //     })
    //   }
    // })

    const jsonDat = JSON.stringify(meaningArr)

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

    fs.writeFile('./src/json/****.json', jsonDat, (err) => {
      if (err) {
        console.error(err)

        return
      }
    })
  })
  console.log('done')
}

runWriter()
