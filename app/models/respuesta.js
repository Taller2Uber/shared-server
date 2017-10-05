function respuesta(){}


respuesta.addError = function(respuesta, code, message){
  var errorProperty =  {"code": code, "message": message};
  respuesta.error = errorProperty;
  return respuesta;
}

respuesta.addResult = function( respuesta, resultado ){
  respuesta.resultado = resultado;
  return respuesta;
}

respuesta.addDescription = function ( respuesta, description ){
  respuesta.description = description;
  return respuesta;
}

module.exports = respuesta;
