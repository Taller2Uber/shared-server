var express = require('express');
var server = express();
var bodyParser = require('body-parser');
var methodOverride = require('method-override');


var port = process.env.PORT || 3000;

//Configuracion de la base de datos Postgresql
var db = require('./app/config/pgdb');

//Agrego layers al server con app.use()
server.use(bodyParser.json());

server.use(bodyParser.urlencoded({ extended: true }));

server.use(methodOverride('X-HTTP-Method-Override'));

//Configuro routes
require('./app/routes/appserverRoutes')(server);


// escucho en http://localhost:3000/
server.listen(port);

//Exporto para poder utilizar el server en otros modulos
exports = module.exports = server;
