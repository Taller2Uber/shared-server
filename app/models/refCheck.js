var hash = require('json-hash');

function refHash(){}

refHash.generate = function( dataToHash ){
  return hash.digest(dataToHash);
};

module.exports = refHash;
