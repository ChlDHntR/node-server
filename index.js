const { config } = require('dotenv')
config() // Load environment variables from .env file

const app = require('./src/app.js')

const PORT = process.env.PORT || 3003
app.listen(PORT, () => {
  console.log(`server is running at port ${PORT}`)
})
