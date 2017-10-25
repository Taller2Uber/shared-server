function respuesta(){}

var Version = '1.0';

respuesta.addError = function(respuesta, code, message){
  var errorProperty =  {"code": code, "message": message};
  respuesta.error = errorProperty;
  return respuesta;
}

respuesta.addResult = function( respuesta, resultName, resultado ){
  respuesta[resultName] = resultado;
  return respuesta;
}

respuesta.addDescription = function ( respuesta, description ){
  respuesta.description = description;
  return respuesta;
}

respuesta.addToken = function( respuesta, Token ){
  respuesta.token = {
    expiresAt: 0,
    token: Token
  }
  return respuesta;
}

respuesta.addEntityMetadata = function( respuesta ){
  respuesta.metadata = {
    version: Version
  }
  return respuesta;
}

respuesta.addCollectionMetadata = function( respuesta, results ){
  respuesta.metadata = {
    count: results.length,
    total: results.length,
    next: null,
    prev: null,
    first: null,
    last: null,
    version: Version
  }
  return respuesta;
}
module.exports = respuesta;
