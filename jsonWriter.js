import * as fs from 'fs'

const runWriter = async () => {
  const obj = {}

  for (let i = 1; i <= 10; i++) {
    let dat = fs.readFileSync(`./src/json/monolang/term_bank_${i}.json`)
    const arrChild = JSON.parse(dat)
    arrChild.forEach((element) => {
      obj[element[0]] = element[5][0] 
    })
  }
  const jsonDat = JSON.stringify(obj)
  fs.writeFile('./src/json/monolang/map.json', jsonDat, (err) => {
        if (err) {
          console.error(err)
          return
        }
    })
}

runWriter()
