var logger = require('./app/config/logger.js');
var express = require('express');
var server = express();
var bodyParser = require('body-parser');
var methodOverride = require('method-override');
var herokuLogger = require('./app/config/herokuLogger');


var port = process.env.PORT || 3000;

var db = require('./app/config/pgdb');

logger.info('Inicio el server')
herokuLogger.info('Inicio el server')
server.use(bodyParser.json());

server.use(bodyParser.urlencoded({ extended: true }));

server.use(methodOverride('X-HTTP-Method-Override'));

require('./app/routes/appserverRoutes')(server);


server.listen(port);

exports = module.exports = server;
