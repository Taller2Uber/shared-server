var logger = require('./app/config/herokuLogger.js');
var express = require('express');
var server = express();
var bodyParser = require('body-parser');
var methodOverride = require('method-override');
var session = require('express-session')
var db = require('./app/config/pgdb');

var port = process.env.PORT || 3000;


logger.info('Bienvenido!');
server.use(bodyParser.json());

server.use(bodyParser.urlencoded({ extended: true }));


/**
* @description SecretKey obligatoria para el manejo de sesiones.
*/
server.use(session({secret: 'grupo7'}));

server.use(methodOverride('X-HTTP-Method-Override'));


require('./app/routes/appserverRoutes')(server);
require('./app/routes/businessUsersRoutes')(server);
require('./app/routes/appuserRoutes')(server);
require('./app/routes/noWayRoute')(server);





server.listen(port);
logger.info('Servidor esperando peticiones...');

exports = module.exports = server;
