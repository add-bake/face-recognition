const express = require('express')
const request = require('request')
const app = express()
const fs = require('fs')
const https = require('https')
const privateKey = fs.readFileSync('./certificate/key.pem', 'utf8')
const certificate = fs.readFileSync('./certificate/cert.pem', 'utf8')
const credentials = {key: privateKey, cert: certificate}
const bodyParser = require('body-parser')
const qs = require('querystring')
let token = {}

// https配置
const httpsServer = https.createServer(credentials, app)
const SSLPORT = 8888

httpsServer.listen(SSLPORT, () => {
  console.log('Example app listening at https://localhost:', SSLPORT);
})

// express配置
app.use(bodyParser.urlencoded({extended: false}))
app.use(bodyParser.json({limit: '50mb'}))

// express设置跨域访问
app.all('*', (req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Content-Type,Accept");
  res.header("Access-Control-Allow-Methods","PUT,POST,GET,DELETE,OPTIONS");
  res.header("X-Powered-By",' 3.2.1');
  res.header("Content-Type", "application/json;charset=utf-8");
  next();
})

// 获取token配置
const param = qs.stringify({
  'grant_type': 'client_credentials',
  'client_id': 'iamToWyWiyufkLBOuaY7F1M0',
  'client_secret': '0sOlCfVoI0okrofIZaShsdk9LicExs4g'
})

//获取token
getToken()

// 处理用户提交图片
app.post('/auth', (req, res) => {
  let src = req.body.src
  sendAuth(res, src)
})

// 获取token
function getToken () {
  https.get({
    hostname: 'aip.baidubce.com',
    path: '/oauth/2.0/token?' + param,
    agent: false
  }, res => {
    let body = []
    res.on('data', (d) => {
      body.push(d)
    })
    res.on('end', () => {
      let data = Buffer.concat(body).toString()
      token = JSON.parse(data)
    })
  }).on('error', err => {
    console.log(`get token error: ${err}`)
  })
}

// 提交阿里云活体检测验证
function sendAuth (res, src) {
  let options = {
    headers: {
      'Content-Type': 'application/json'
    },
    url: `https://aip.baidubce.com/rest/2.0/face/v3/match?access_token=${token.access_token}`,
    method: 'POST',
    json: true,
    body: [{
      'image': 'http://res.qiangdaoapp.com/yjtong2/image/2019/01/26/154848802370281612.jpg',
      'image_type': 'URL',
      'face_type': 'CERT'
    }, {
      'image': src,
      'image_type': 'BASE64',
      'face_type': 'LIVE',
      'quality_control': 'NORMAL',
      'liveness_control': 'NORMAL'
    }]
  }

  request(options, (error, response, data) => {
    console.log(data)
    if (!error && response.statusCode === 200) {
      res.status(200)
      res.json({code: data.error_code || 0, ...data})
    } else {
      console.log(`sendAuth error: ${error}`)
    }
  })
}
