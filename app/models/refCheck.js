var hash = require('json-hash');

/**
 * @class Clase para generar el hash de todos los objetos del sistema que lo precisen
 */

function refHash(){}

/**
* @name generate
* @function generate
* @memberof refHash
* @author Gustavo Adrian Gimenez
* @param dataToHash Objeto a hashear
*/

refHash.generate = function( dataToHash ){
  return hash.digest(dataToHash);
};

module.exports = refHash;
