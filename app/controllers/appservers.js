var idGlobal;
var randtoken = require('rand-token');
var clientDb = require('../models/database');

exports.getAll = function( req, res ) {
  var results = [];
  results = clientDb.getAllUsers(res, results);
};

exports.create = function( name, res ){
    var token = randtoken.generate(32);
    if(name){
      clientDb.createUser( res, name, token );
    }else {
      res.status(400).send('Incumplimiento de precondiciones (parámetros faltantes)');
    }
};


exports.deleteUser = function(userId, token, res){

  clientDb.deleteUser( res, userId, token);

};
