let express = require('express')
let app = express()

// 设置跨域访问
app.all('*', (req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "X-Requested-With");
  res.header("Access-Control-Allow-Methods","PUT,POST,GET,DELETE,OPTIONS");
  res.header("X-Powered-By",' 3.2.1');
  res.header("Content-Type", "application/json;charset=utf-8");
  next();
})

let questions = [
  {
    data: '213',
    num: '444',
    age: 12
  },
  {
    data: '200',
    num: '555',
    age: 15
  }
]

// 接口getData
app.get('/getData', (req, res) => {
  res.status(200),
  res.json(questions)
})

// 配置服务端口
let server = app.listen(8888, () => {
  let host = server.address().address
  let port = server.address().port

  console.log('Example app listening at http://%s:%s', host, port);
})
