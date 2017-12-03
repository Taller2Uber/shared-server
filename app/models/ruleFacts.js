var respuesta = require('./respuesta')
var request = require('request')
var RuleEngine = require('node-rules')

var weekdays = ['domingo', 'lunes', 'martes', 'miercoles', 'jueves', 'viernes', 'sabado'];

/**
 * @class Clase para obtener el precio de un viaje, sea estimado o final, obteniendo las reglas desde la base de datos.
 */

function ruleFacts(){}

/**
* @name distanceInKm
* @function distanceInKm
* @memberof ruleFacts
* @author Gustavo Adrian Gimenez
* @param lat1
* @param lon1
* @param lat2
* @param lon2
*/

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

/**
* @name distanceInKm
* @function distanceInKm
* @memberof ruleFacts
* @author Gustavo Adrian Gimenez
* @param startAddress Objeto direccion del inicio de viaje
* @param endAddress Objeto direccion del fin de viaje
* @param balance Balance del pasajero
* @param factt Objeto que contiene los distintos parametros a tener en cuenta para la ejecucion de las reglas y obtencion del precio
* @param callback Objeto para devolver un objeto con el precio obtenido.
*/

ruleFacts.getEstimateFact = function(startAddress, endAddress, balance, factt,callback ){
  var fact = {}
  fact.cost = 0;
  fact.gain = 0; // ganancia del conductor.
  fact.discount = 1;
  fact.driverDiscount = 1; //porcentaje de pago del conductor.
  fact.tripOk = true;
  fact.balance = factt.passenger.balance;
  fact.fecha = factt.fecha;
  fact.waitTime = factt.waitTime;
  fact.travelTime = factt.travelTime;
  fact.passenger = factt.passenger;
  fact.driver = factt.driver;
  console.log(fact.passenger)
  fact.mail = factt.mail;
  distanceInKm( startAddress.location.lat, startAddress.location.lon, endAddress.location.lat, endAddress.location.lon, function(resultado){
    fact.distance = resultado;
  })
  var RuleArray;

  request({
  	url:"http://taller2-grupo7-shared.herokuapp.com/api/rules",
  	method: "GET"
  	}, function(error, res, body){
      var rules = JSON.parse(body);
      var array = []
      RuleArray = new RuleEngine([],{ignoreFactChanges: true})
      for (var rule of rules.rules){
        if(rule.active === true){
          var ruleCode = rule.blob;
          ruleCode.on = true;
          array.push(ruleCode[0])
        }
      }
      RuleArray.fromJSON(array);
      RuleArray.execute( fact, function( coti ){
        console.log("ganancia del conductor: " + coti.gain * coti.driverDiscount)
        console.log("porcentaje conductor: " + coti.driverDiscount)
        callback(coti);
      })
  })

  /*
  request({
  	url:"http://localhost:3000/api/rules/14",
  	method: "GET"
  	}, function(error, res, body){
  		var result = JSON.parse(body);
  		var ruleCode = result.rule.blob;
  		ruleCode.on = true;
  		RuleArray = new RuleEngine([],{ignoreFactChanges: true})
  		RuleArray.fromJSON(ruleCode)
  		console.log(RuleArray)
      RuleArray.execute( fact, function( coti ){
        callback(coti);
      })
  })*/
}

module.exports = ruleFacts;
