const { getBookList } = require('../services/bookService.js')

const getBooks = (req, res) => {
  res.json(getBookList())
}

module.exports = { getBooks }
