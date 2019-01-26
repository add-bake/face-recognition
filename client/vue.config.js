const fs = require('fs')
const path = require('path')

function resolve (x) {
  return path.resolve(__dirname, x)
}

module.exports = {
  devServer: {
    https: {
      key: fs.readFileSync(resolve('./certificate/key.pem')),
      cert: fs.readFileSync(resolve('./certificate/cert.pem'))
      // ca: fs.readFileSync(resolve('./certificate'))
    }
  }
}
