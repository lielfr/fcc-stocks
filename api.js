var express = require('express');
var co = require('co');
var request = require('sync-request');
var utils = require('./utils');


var getStocksOptions = (stock, diff=365.25) => {
  let options = {
    uri: 'http://chart.finance.yahoo.com/table.csv',
    qs: {}
  };
  let prevDate = new Date(Date.now() - 1000 * 3600 * 24 * diff);
  let currDate = new Date();
  options.qs.s = stock;
  options.qs.a = prevDate.getMonth() + 1;
  options.qs.b = prevDate.getDate();
  options.qs.c = prevDate.getFullYear();
  options.qs.d = currDate.getMonth() + 1;
  options.qs.e = currDate.getDate();
  options.qs.f = currDate.getFullYear();
  options.qs.g = 'd';
  options.qs.ignore = '.csv';

  return options;
};

var parseCSV = (str) => {
  let lines = str.split('\n')
  lines = lines.slice(1, lines.length - 1); // Header and footer cleanup.
  let dateLabel = lines.map((item) => item.split(',')[0]);
  let openData = lines.map((item) => item.split(',')[1]);

  return [dateLabel, openData];
}

var makeRequest = (stock) => {
  let options = getStocksOptions(stock);
  let req = request('GET', options.uri, {qs: options.qs});
  if (req.statusCode !== 200)
    return false;
  return parseCSV(req.getBody('utf8'));
};

var router = express.Router();
router.get('/:stocks', (req, res) => {
  var stocks = req.params.stocks.split(',');
  var labels = [];
  var dataSets = [];
  stocks.forEach((stock) => {
    var csvData = makeRequest(stock);
    if (!csvData)
      return;
    if (labels.length === 0)
      labels = csvData[0].reverse();
    var gColor = '#ffff00';
    dataSets.push({
      label: stock,
      data: csvData[1].reverse(),
      borderColor: gColor,
      backgroundColor: gColor,
      pointStyle: 'line'
    });
  });
  utils.fillColors(labels, dataSets);
  res.end(JSON.stringify({
    type: 'line',
    data: {
      labels: labels,
      datasets: dataSets
    },
    options: {
      scales: {
        yAxes: [{
          stacked: true
        }]
      },
      hover: {
        mode: 'x-axis'
      },
      tooltips: {
        mode: 'x-axis'
      }
    }
  }));
});


module.exports = router;
