var logger = require('./app/config/herokuLogger.js');
var express = require('express');
var server = express();
var bodyParser = require('body-parser');
var methodOverride = require('method-override');
var db = require('./app/config/pgdb');

var port = process.env.PORT || 3000;


logger.info('Bienvenido!');
server.use(bodyParser.json());

server.use(bodyParser.urlencoded({ extended: true }));



server.use(methodOverride('X-HTTP-Method-Override'));

server.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", '*');
    res.header("Access-Control-Allow-Credentials", true);
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
    res.header("Access-Control-Allow-Headers", 'Origin,X-Requested-With,Content-Type,Accept,content-type,application/json');
    next();
});


require('./app/routes/appserverRoutes')(server);
require('./app/routes/businessUsersRoutes')(server);
require('./app/routes/appuserRoutes')(server);
require('./app/routes/noWayRoute')(server);





server.listen(port);
logger.info('Servidor esperando peticiones...');

exports = module.exports = server;
