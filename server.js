var logger = require('./app/config/herokuLogger.js');
var express = require('express');
var server = express();
var bodyParser = require('body-parser');
var methodOverride = require('method-override');
var db = require('./app/config/pgdb');
var path = require('path');

var port = process.env.PORT || 3000;


logger.info('Bienvenido!');
server.use(bodyParser.json());

server.use(bodyParser.urlencoded({ extended: true }));
server.use(express.static(__dirname));


server.use(methodOverride('X-HTTP-Method-Override'));

var allowCrossDomain = function(req, res, next) {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');

    // intercept OPTIONS method
    if ('OPTIONS' == req.method) {
      res.send(200);
    }
    else {
      next();
    }
};

server.use(allowCrossDomain);


server.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", '*');
    res.header("Access-Control-Allow-Credentials", true);
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
    res.header("Access-Control-Allow-Headers", 'Origin,X-Requested-With,Content-Type,Accept,content-type,application/json');
    next();
});

server.use(express.static(__dirname  ,'src','app'));

server.get('/', function (req, res) {
  res.sendFile(path.join(__dirname, 'src', 'index.html'))
});

require('./app/routes/appserverRoutes')(server);
require('./app/routes/businessUsersRoutes')(server);
require('./app/routes/tripsRoutes')(server);
require('./app/routes/paymethodsRoutes')(server);
require('./app/routes/appuserRoutes')(server);
require('./app/routes/rulesRoutes')(server);
require('./app/routes/noWayRoute')(server);

server.listen(port);
logger.info('Servidor esperando peticiones...');

exports = module.exports = server;
