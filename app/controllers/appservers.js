var idGlobal;
var randtoken = require('rand-token');
var clientDb = require('../models/database');

exports.getAll = function( req, res ) {
  var results = [];
  results = clientDb.getAllUsers(res, results);
};

exports.create = function( name, res ){
    var token = randtoken.generate(32);

    clientDb.createUser( name, token );

    res.send('name: '+ name + ', token: ' + token );
};
