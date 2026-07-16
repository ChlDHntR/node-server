const fs = require('fs')
const path = require('path')

// public/book1 relative to this file (src/services/bookService.js)
const bookDir = path.join(__dirname, '..', '..', 'public', 'book1')

/**
 * Return the list of available books by scanning public/book1 for .epub files.
 * The names are returned without the .epub extension (e.g. "makeine4"), which
 * is what the frontend uses to request /book1/<name>.epub.
 *
 * @returns {string[]}
 */
const getBookList = () => {
  try {
    return fs
      .readdirSync(bookDir)
      .filter((file) => path.extname(file).toLowerCase() === '.epub')
      .map((file) => path.basename(file, path.extname(file)))
      .sort()
  } catch (err) {
    console.error(`Failed to read book directory ${bookDir}:`, err)
    return []
  }
}

module.exports = { getBookList }
