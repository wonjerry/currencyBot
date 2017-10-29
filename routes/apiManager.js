var request = require('request')

module.exports.getCurrency = function (req, res) {
  var options = {
    method: 'GET',
    url: 'https://query.yahooapis.com/v1/public/yql?q=select%20*%20from%20yahoo.finance.xchange%20where%20pair%20in%20(%22KRW%22%2C%22JPY%22)&format=json&diagnostics=true&env=store%3A%2F%2Fdatatables.org%2Falltableswithkeys',
    headers:
      {
        'cache-control': 'no-cache',
        'content-type': 'application/json'
      },
    json: true
  }

  request(options, function (error, response, body) {
    if (error) throw new Error(error)
    var data = body.query.results.rate
    var result = ((data[0].Rate / data[1].Rate) * 100).toFixed(2)
    console.log(result)
    res.json({result: result})
  })
}

module.exports.keyBoard = function (req, res) {
  res.json({
    'type': 'buttons',
    'buttons': ['일본 환율', '서비스 준비중']
  })
}

module.exports.parseMessage = function (req, res) {

  var d = new Date()
  var now = d.getDate()
  var callback = function () {
    var massage = {
      'message': {
        'text': '오늘의 엔화 환율은 ' + global.currency + ' 입니다'
      },
      'keyboard': {
        'type': 'buttons',
        'buttons': ['일본 환율']
      }
    }
    res.set({
      'content-type': 'application/json'
    }).send(JSON.stringify(massage))
  }

  // 이미 했을 때 날짜가 같으면 ㅃㅃ 다르면 날짜 다시 등록하고 뒤의 함수 실행
  if (global.already) {
    if (global.date === now) {
      callback()
      return
    }
    else global.date = now
  }

  getCurrency(req, res, callback)
}

function getCurrency (req, res, callback) {

  var options = {
    method: 'GET',
    url: 'http://apilayer.net/api/live?access_key=08b4f2720ea37d7f02d409b3f8d92bff&currencies=KRW,JPY&format=1',
    headers:
      {
        'cache-control': 'no-cache',
        'content-type': 'application/json'
      },
    json: true
  }

  request(options, function (error, response, body) {
    if (error) throw new Error(error)
    if (body.error) throw new Error(body.error)
    console.log(body)

    var data = body.quotes
    var result = ((data['USDKRW'] / data['USDJPY']) * 100).toFixed(2)

    console.log('오늘의 엔화 환율은 ' + result + ' 입니다')
    global.already = true
    global.currency = result
    callback(result)
  })
}

