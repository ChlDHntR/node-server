const unknownEndpoint = (req, res) => {
  res.status(404).send({ error: 'unknown endpoint' })
}

// eslint-disable-next-line no-unused-vars
const errorHandler = (err, req, res, next) => {
  console.error(err)
  res.status(500).json({ error: 'internal server error' })
}

module.exports = { unknownEndpoint, errorHandler }
