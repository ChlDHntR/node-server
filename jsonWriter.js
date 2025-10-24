const fs = require('fs')

const runWriter = async () => {
  const retObj = {}

  for (let i = 1; i <= 2; i++) {
    let dat = fs.readFileSync(`./src/json/hantu/kanji_bank_${i}.json`)
    const arrChild = JSON.parse(dat)
    arrChild.forEach((el) => {
      retObj[el[0]] = [el[1],el[4]]
    })
  }
  const jsonDat = JSON.stringify(retObj)
  fs.writeFile('./src/json/hantu.json', jsonDat, (err) => {
        if (err) {
          console.error(err)
          return
        }
    })
}

runWriter()
