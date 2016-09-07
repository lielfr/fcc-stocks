var express = require('express');
var app = express();
var server = require('http').Server(app);
var io = require('socket.io')(server);
var helmet = require('helmet');
var pug = require('pug');
var api = require('./api');

app.set('view engine', 'pug');
app.set('views', './views')
app.use(helmet());
app.use('/static', express.static(__dirname + '/static'));

app.use('/api', api);
app.get('/', (req, res) => {
  res.render('index');
});

var allStocks = ['AAPL', 'GOOGL'];


io.on('connection', (socket) => {
  socket.emit('stocksUpdate', allStocks);
  socket.on('stocksUpdate', (stocks) => {
    console.log('Updating stocks to: ' + stocks);
    allStocks = stocks;
    io.emit('stocksUpdate', allStocks);
  });
});

server.listen(process.env.PORT);
