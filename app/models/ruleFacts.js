var RuleArray = require('./cotizacionDB')
var respuesta = require('./respuesta')

function ruleFacts(){}

distanceInKm = function(lat1, lon1, lat2, lon2, callback){
  var R = 6371; // Radio terresetre
  var dLat = deg2rad(lat2-lat1);
  var dLon = deg2rad(lon2-lon1);
  var a =
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) *
    Math.sin(dLon/2) * Math.sin(dLon/2)
    ;
  var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  var d = R * c; //Distancia en KM
  callback(d);
}

function deg2rad(deg) {
  return deg * (Math.PI/180)
}

ruleFacts.getEstimateFact = function( startAddress, endAddress, callback ){
  var fact = {}
  fact.cost = 0;
  fact.discount = 1;
  fact.tripOk = true;
  fact.balance = -1;
  fact.fecha = new Date();
  distanceInKm( startAddress.location.lat, startAddress.location.lon, endAddress.location.lat, endAddress.location.lon, function(resultado){
    fact.distance = resultado;
  })
  RuleArray.execute( fact, function( coti ){
    var respuestaJson = {}
    callback(coti);
  })
}

module.exports = ruleFacts;
