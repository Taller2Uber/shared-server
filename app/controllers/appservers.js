var idGlobal;
var randtoken = require('rand-token');

exports.getAll = function( req, res ) {
    res.send( 'Listar todos los appservers' );
};

exports.create = function( name, res ){
    var token = randtoken.generate(32);
    var fecha = new Date().toLocaleString();
    res.send('name: '+ name + ', token: ' + token + ", fecha de creacion: " + fecha);
};
