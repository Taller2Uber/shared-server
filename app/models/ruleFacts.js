var respuesta = require('./respuesta')
var request = require('request')
var RuleEngine = require('node-rules')

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

ruleFacts.getEstimateFact = function(startAddress, endAddress, balance, factt,callback ){
  var fact = {}
  fact.cost = 0;
  fact.discount = 1;
  fact.tripOk = true;
  fact.balance = -1;
  fact.fecha = factt.fecha;
  fact.mail = 'gustavo@llevame.com';
  distanceInKm( startAddress.location.lat, startAddress.location.lon, endAddress.location.lat, endAddress.location.lon, function(resultado){
    fact.distance = resultado;
    console.log(resultado);
  })
  var RuleArray;

  request({
  	url:"http://localhost:3000/api/rules",
  	method: "GET"
  	}, function(error, res, body){
      var rules = JSON.parse(body);
      var array = []
      RuleArray = new RuleEngine([],{ignoreFactChanges: true})
      for (var rule of rules.rules){
        var ruleCode = rule.blob;
        ruleCode.on = true;
        array.push(ruleCode[0])
      }
      RuleArray.fromJSON(array);
  		console.log(RuleArray)
      RuleArray.execute( fact, function( coti ){
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
