const express = require('express')
const { getBooks } = require('../controllers/bookController.js')

const router = express.Router()

router.get('/booklist', getBooks)

module.exports = router
