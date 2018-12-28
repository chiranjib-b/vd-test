var express = require('express');
var app = express();
var server = require('http').createServer(app);
var path = require('path');
var cors = require('cors');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var session = require('express-session');

require('./db/db_init');

console.log('Initialized database components. Proceeding..');

// enable cors module for cross origin request
app.use(cors());

//Allow cross origin header requests
app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

app.use(bodyParser.json({ type: 'application/json' }));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());

app.use(session({
    secret: 'secret',
    saveUninitialized: true,
    resave: true
}));

var routes = require('./routes/index');
app.use('/', routes);

app.set('port', (process.env.PORT || 8001));

server.listen(app.get('port'), function() {
    console.log('VaultDragon KeyStore Manager App started on port ' + app.get('port'));
});