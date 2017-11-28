/**
 * @class Clase para generar las respuestas para cada request a la api.
 */

function respuesta(){}

var Version = '1.0';

/**
* @name addError
* @function addError
* @memberof respuesta
* @author Gustavo Adrian Gimenez
* @param respuesta Objeto que obtiene lo que se va a enviara
* @param code Codigo de error
* @param message Mensaje de error
*/

respuesta.addError = function(respuesta, code, message){
  var errorProperty =  {"code": code, "message": message};
  respuesta.error = errorProperty;
  return respuesta;
}

/**
* @name addResult
* @function addResult
* @memberof respuesta
* @author Gustavo Adrian Gimenez
* @param respuesta Objeto que obtiene lo que se va a enviara
* @param resultName Nombre de la key que contiene el resultado. EJemplo: "users"
* @param resultado Objeto que contiene el resultado en si mismo.
*/

respuesta.addResult = function( respuesta, resultName, resultado ){
  respuesta[resultName] = resultado;
  return respuesta;
}

/**
* @name addDescription
* @function addDescription
* @memberof respuesta
* @author Gustavo Adrian Gimenez
* @param respuesta Objeto que obtiene lo que se va a enviara
* @param description Mensaje de descripcion
*/

respuesta.addDescription = function ( respuesta, description ){
  respuesta.description = description;
  return respuesta;
}

/**
* @name addToken
* @function addToken
* @memberof respuesta
* @author Gustavo Adrian Gimenez
* @param respuesta Objeto que obtiene lo que se va a enviara
* @param Token String con el token en si mismo.
*/

respuesta.addToken = function( respuesta, Token ){
  respuesta.token = {
    expiresAt: 0,
    token: Token
  }
  return respuesta;
}

/**
* @name addEntityMetadata
* @function addEntityMetadata
* @memberof respuesta
* @author Gustavo Adrian Gimenez
* @param respuesta Objeto que obtiene lo que se va a enviara
*/

respuesta.addEntityMetadata = function( respuesta ){
  respuesta.metadata = {
    version: Version
  }
  return respuesta;
}

/**
* @name addCollectionMetadata
* @function addCollectionMetadata
* @memberof respuesta
* @author Gustavo Adrian Gimenez
* @param respuesta Objeto que obtiene lo que se va a enviara
* @param results Lista que contiene los resultados enviados
*/

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
