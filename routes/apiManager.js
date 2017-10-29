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