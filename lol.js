import axios from 'axios'

const run = async () => {
  const response = await axios.get('https://drive.google.com/uc?export=download&id=1eCgpywTXmWx99mfR-taxn1iXJ0jCUVj5')
  console.log(response)
}

run()
