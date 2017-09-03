var express        = require('express');
var app            = express();
var bodyParser     = require('body-parser');
var methodOverride = require('method-override');


var port = process.env.PORT || 3000;

//Configuracion de la base de datos Postgresql
var db = require('./app/config/pgdb');

//Agrego layers al server con app.use()
app.use(bodyParser.json());

app.use(bodyParser.urlencoded({ extended: true }));

app.use(methodOverride('X-HTTP-Method-Override'));

//Configuro routes
//require('./app/routes/')(app);


// escucho en http://localhost:3000/
app.listen(port);

//Exporto para poder utilizar el server en otros modulos
exports = module.exports = app;
