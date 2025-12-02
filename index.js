const { config } = require('dotenv')
const express = require('express')
const cors = require('cors')
const { runReader } = require('./jsonReader.js')
const path = require('path')
const { tokenize } = require('kuromojin')

config() // Load environment variables from .env file

const app = express()

// Middleware
const unknownEndpoint = (req, res) => {
  res.status(404).send({ error: 'unknown endpoint' })
}

//const cors = require('cors')
app.use(cors()) // middleware to allow cross-origin requests

app.use('/book1', express.static(path.join(__dirname, 'public/book1')))

app.use(express.json()) // middleware to parse JSON bodies

app.get('/api/booklist', (req, res) => {
  let bookList = ['makeine4', 'makeine5', 'amamori1', 'amamori2']
  res.json(bookList)
})

app.post('/api/analyze', (req, res) => {
  // const body = req.body

  // if (!body) {
  //   return res.status(400).json({
  //     error: 'content missing',
  //   })
  // }

  let text = req.body.content

  const ret = { analyze: [], runReader: [] }
  let test = runReader(text)

  if (test.status) {
    ret.runReader.push(test)
    ret.analyze.push({ basic_form: '', surface_form: text })
    res.json(ret)
    return
  }

  tokenize(text)
    .then((token) => {
      let resArr = token.map(({ surface_form, basic_form }) => {
        ret.runReader.push(runReader(basic_form))
        return { surface_form, basic_form }
      })
      ret.analyze = resArr

      res.json(ret)
    })
    .catch((err) => {
      /* 
      NEWEST change here
      handle tokenize error 
    */
      ret.runReader.push(test)
      ret.analyze.push({ basic_form: '', surface_form: text })
      res.json(ret)
    })
})

app.use(unknownEndpoint)
const PORT = process.env.PORT || 3003
app.listen(PORT, () => {
  console.log(`server is running at port ${PORT}`)
})
