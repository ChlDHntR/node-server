// const http = require('http')

// const app = http.createServer((request, response) => {
//   response.writeHead(200, { 'Content-Type': 'text/plain' })
//   response.end('Hello World')
// })

// const PORT = 3003
// app.listen(PORT)
// console.log(`Server running on port ${PORT}`)
import { runReader } from './jsonReader.js'
import express from 'express'
import cors from 'cors'

//const express = require('express')

const app = express()

// Middleware
const unknownEndpoint = (req, res) => {
  res.status(404).send({ error: 'unknown endpoint' })
}

//const cors = require('cors')
app.use(cors()) // middleware to allow cross-origin requests

const generateId = () => {
  const maxId = notes.length > 0
  ? Math.max(...notes.map(n => Number(n.id)))
  : 0
  return String(maxId + 1)
}

const notes = [
  {
    id: "1",
    content: "HTML is easy",
    important: true
  },
  {
    id: "2",
    content: "Browser can execute only JavaScript",
    important: false
  },
  {
    id: "3",
    content: "GET and POST are the most important methods of HTTP protocol",
    important: true
  }
]

app.get('/', (req, res) => {
  res.send('<h1> Hello World 2 </h1>')
})  

app.get('/api/notes', (req, res) => {
  res.json(notes)
})

app.get('/api/notes/:id', (req, res) => {
  const id = req.params.id
  const note = notes.find((note) => note.id === id)
  res.send(note)
})

app.delete('/api/notes/:id', (req, res) => {
  const id = req.params.id
  notes = notes.filter(note => note.id !== id)
  res.status(204).end()
})

app.post('/api/search', (req, res) => {
  if (!body.content) {
    return res.status(400).json({ 
      error: 'content missing' 
    })
  }
  
  const word = req.body
  res.json(runReader(word))
  
})

app.post('/api/notes', (req, res) => {
  const body = req.body
  
  if (!body.content) {
    return res.status(400).json({ 
      error: 'content missing' 
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