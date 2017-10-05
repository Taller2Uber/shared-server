var respuesta = require('../models/respuesta')
var async = require('asyncawait/async')
var await = require('asyncawait/await')

function loginCheck(){}

loginCheck.check = function( req, res ){
  if( !req.session.authenticated){
    var respuestaJson = {};
    respuestaJson = respuesta.addError(respuestaJson, 401, 'Unauthorized');
    res.status(401).json(respuestaJson);
    return false;
  }else {
    return true;
  }
};

module.exports = loginCheck;
