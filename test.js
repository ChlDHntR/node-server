const kuromoji =  require('kuromoji')

// Promisify the tokenizer builder
function buildTokenizerAsync() {
  return new Promise((resolve, reject) => {
    kuromoji.builder({ dicPath: './src/json/dict'  }).build((err, tokenizer) => {
      if (err) {
        reject(err);
      } else {
        resolve(tokenizer);
      }
    });
  });
}

// Promisify the tokenize method
function tokenizeAsync(tokenizer, text) {
  return new Promise((resolve, reject) => {
    tokenizer.tokenize(text, (err, tokens) => {
      if (err) {
        reject(err);
      } else {
        console.log(text)
        resolve(tokens);
      }
    });
  });
}

// Main async function
async function analyzeText(text) {
  try {
    const tokenizer = await buildTokenizerAsync();
    
    console.log(tokenizer)   

    const tokens = await tokenizeAsync(tokenizer, text);
    
    // Your function will only return after tokenization is complete
    return tokens;
  } catch (error) {
    console.error('Error:', error);
    throw error;
  }
}

// Usage
analyzeText('こんにちは世界').then(tokens => {
  console.log('Result:', tokens);
});