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

server.listen(process.env.PORT | 8080);
