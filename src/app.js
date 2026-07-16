const express = require('express')
const cors = require('cors')
const path = require('path')

const bookRoutes = require('./routes/bookRoutes.js')
const analyzeRoutes = require('./routes/analyzeRoutes.js')
const { unknownEndpoint, errorHandler } = require('./middleware/errorHandlers.js')

const app = express()

// Middleware
app.use(cors()) // allow cross-origin requests
app.use('/book1', express.static(path.join(__dirname, '..', 'public/book1')))
app.use(express.json()) // parse JSON bodies

// Routes
app.use('/api', bookRoutes)
app.use('/api', analyzeRoutes)

// Error handling
app.use(unknownEndpoint)
app.use(errorHandler)

module.exports = app
