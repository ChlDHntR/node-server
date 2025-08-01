// const http = require('http')

// const app = http.createServer((request, response) => {
//   response.writeHead(200, { 'Content-Type': 'text/plain' })
//   response.end('Hello World')
// })

// const PORT = 3003
// app.listen(PORT)
// console.log(`Server running on port ${PORT}`)
const { config } = require('dotenv')
const express = require('express')
const cors = require('cors')
const { runReader } = require('./jsonReader.js')
const path = require('path')
const { tokenize } = require('kuromojin')

config() // Load environment variables from .env file

const app = express()

const list = {
  list: ['makeine4', 'makeine5'],
}

// Middleware
const unknownEndpoint = (req, res) => {
  res.status(404).send({ error: 'unknown endpoint' })
}

//const cors = require('cors')
app.use(cors()) // middleware to allow cross-origin requests

const generateId = () => {
  const maxId = notes.length > 0 ? Math.max(...notes.map((n) => Number(n.id))) : 0
  return String(maxId + 1)
}

const notes = [
  {
    id: '1',
    content: 'HTML is easy',
    important: true,
  },
  {
    id: '2',
    content: 'Browser can execute only JavaScript',
    important: false,
  },
  {
    id: '3',
    content: 'GET and POST are the most important methods of HTTP protocol',
    important: true,
  },
]
console.log(path.join(__dirname, 'public/book1'))

app.use('/book1', express.static(path.join(__dirname, 'public/book1')))
app.get('/view-epub', (req, res) => {
  const filePath = path.join(__dirname, 'src', 'json', 'test.epub')
  res.sendFile(filePath)
})

app.use(express.json()) // middleware to parse JSON bodies
app.get('/home', (req, res) => {
  res.send('<h1> Hello World 2 </h1>')
})

app.get('/api/notes', (req, res) => {
  res.json(notes)
})

app.get('/api/booklist', (req, res) => {
  res.json(list)
})

app.delete('/api/notes/:id', (req, res) => {
  const id = req.params.id
  notes = notes.filter((note) => note.id !== id)
  res.status(204).end()
})

app.post('/api/analyze', (req, res) => {
  const body = req.body

  if (!body) {
    return res.status(400).json({
      error: 'content missing',
    })
  }

  const ret = { analyze: [], runReader: [] }
  let test = runReader(body.content)

  if (test.answer !== 'no result found') {
    ret.runReader.push(test)
    ret.analyze.push({ basic_form: '', surface_form: body.content })
    res.json(ret)
    return
  }

  tokenize(body.content).then((token) => {
    let resArr = token.map(({ surface_form, basic_form }) => {
      ret.runReader.push(runReader(basic_form))
      return { surface_form, basic_form }
    })
    ret.analyze = resArr

    res.json(ret)
  })
})

app.post('/api/notes', (req, res) => {
  const body = req.body

  if (!body.content) {
    return res.status(400).json({
      error: 'content missing',
    })
  }

  const note = {
    content: body.content,
    important: Boolean(body.important) || false,
    id: generateId(),
  }

  notes = notes.concat(note)

  res.json(note)
})

app.use(unknownEndpoint)
const PORT = process.env.PORT || 3003
app.listen(PORT, () => {
  console.log(`server is running at port ${PORT}`)
})
