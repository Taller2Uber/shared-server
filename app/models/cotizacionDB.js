var RuleEngine = require('node-rules')

var weekdays = ['domingo', 'lunes', 'martes', 'miercoles', 'jueves', 'viernes', 'sabado'];

var rules = [];

var oneRules = [
	{
		"priority": 6,
		"name": "Balance negativo no puede viajar",
		"condition": function(R) {
			R.when(this && this.balance < 0);
		},
		"consequence": function(R) {
	    this.tripOk = false;
			R.stop();
		}
	},
	{
		"priority": 5,
		"name": "Viaja gratis por mail @llevame.com",
		"condition": function(R) {
			var mail = []
			if( this.mail ){
				mail = this.mail.split('@')
			}
				R.when(this && (mail[1] == 'llevame.com'));
		},
		"consequence": function(R) {
	    this.cost = 0;
			R.stop();
		}
	},
	{
		"priority": 2,
		"name": "Costo minimo debe ser $50",
		"condition": function(R) {
			if( this.cost && this.discount ){
				R.when(this && ( this.cost * this.discount ) < 50);
			}
		},
		"consequence": function(R) {
			this.tripOk = false;
			R.stop();
		}
	},
	{
		"priority": 4,
		"name":"Precio de $15 por KM",
		"condition": function(R){
			if ( this.distance ){
				R.when(this && this.distance > 0)
			}
		},
		"consequence" : function(R){
			this.cost = this.cost + this.distance * 15;
			R.next();
		}
	},
	{
		"priority": 3,
		"name":"descuento del 5% los miercoles",
		"condition": function(R){
			var dia = ''
			if ( this.fecha ){

				dia = weekdays[ new Date(this.fecha).getDay() ];
			}
				R.when(this && dia == 'miercoles')
		},
		"consequence": function(R){
			this.discount -= 0.05;
			R.next();
		}
	},
	{
		"priority": 3,
		"name":"recargo del 10% los lunes",
		"condition": function(R){
			var dia = ''
			if( this.fecha ){
				dia = weekdays[ new Date(this.fecha).getDay() ];
			}
				R.when(this && dia == 'lunes')
		},
		"consequence": function(R){
			this.discount += 0.10;
			R.next();
		}
	},
	{
		"priority": 1,
		"name": "descuento de $100 por ser el primer viaje",
		"condition" : function(R){
			R.when(this && this.cantViajes == 0);
		},
		"consequence" : function(R){
			if( this.cost >= 100) this.cost -= 100;
			else this.cost = 0;
			R.stop();
		}
	},
	{
		"priority": 3,
		"name" : "Recargo de 15% si hubo mas de 10 viajes en los ultimos 30 min",
		"condition" : function(R){
			R.when(this && this.totalTrips > 10);
		},
		"consequence" : function(R){
			this.discount += 0.15;
			R.next();
		}
	},
	{
		"priority": 3,
		"name" : "Descuento de 5% a partir del 5to viaje en el dia",
		"condition" : function(R){
			R.when(this && this.ownDailyTrips > 4);
		},
		"consequence" : function(R){
			this.discount -= 0.05;
			R.next();
		}
	}
]

/*var fact = {
    "distance": 10,
    "mail":"gustavo@llevame.com",
		"fecha": "20/12/2017",
		"cost": 0,
		"discount": 1,
		"tripOk": true,
		"ownDailyTrips": 10,
		"totalTrips": 30
};
*/
var RuleArray = new RuleEngine(oneRules, {ignoreFactChanges : true});


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


module.exports = RuleArray;
