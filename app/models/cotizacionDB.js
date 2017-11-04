var RuleEngine = require('node-rules')

var weekdays = ['domingo', 'lunes', 'martes', 'miercoles', 'jueves', 'viernes', 'sabado'];

var rules = [];

var oneRules = [
	{
		"priority": 5,
		"name": "Viaja gratis por mail @llevame.com",
		"condition": function(R) {
			var mail = this.mail.split('@')
			R.when(this && !this.used && (mail[1] == 'llevame.com'));
			this.used = true;
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
			console.log('costo minimo debe ser 50');
			R.when(this && this.cost * this.discount < 50);
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
			R.when(this && this.distance > 0)
		},
		"consequence" : function(R){
			this.cost = this.cost + this.distance * 15;
			//console.log('precio de 15 por km')
			R.next();
		}
	},
	{
		"priority": 3,
		"name":"descuento los miercoles",
		"condition": function(R){
			var arrFecha = this.fecha.split('/');
			var fechaViaje = new Date(arrFecha[2], arrFecha[1] - 1, arrFecha[0]);
			var dia = weekdays[ fechaViaje.getDay() ];
			//console.log(dia);
			R.when(this && dia == 'miercoles')
		},
		"consequence": function(R){
			this.discount -= 0.05;
			R.next();
		}
	},
	{
		"priority": 3,
		"name":"recargo por ser lunes",
		"condition": function(R){
			var arrFecha = this.fecha.split('/');
			var fechaViaje = new Date(arrFecha[2], arrFecha[1] - 1, arrFecha[0]);
			var dia = weekdays[ fechaViaje.getDay() ];
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
			R.next();
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

var domainRule = {
		"name": "Viaja gratis por mail @llevame.com",
		"condition": function(R) {
			var mail = this.mail.split('@')
			R.when(this && (mail[1] == 'llevame.com'));
		},
		"consequence": function(R) {
	    this.costo = 0;
			R.stop();
		}
}

//rules.push(domainRule);

var minCostRule = {
	"name": "Costo minimo debe ser $50",
	"condition": function(R) {
		R.when(this && this.costo < 50);
	},
	"consequence": function(R) {
		this.tripOk = false;
		R.stop();
	}
}

//rules.push(minCostRule);

var costForKmRule = {
	"name":"Precio de $15 por KM",
	"condition": function(R){
		R.when(this && this.distance > 0)
	},
	"consequence" : function(R){
		this.cost = this.cost + this.distance * 15;
		R.stop();
	}
}

//rules.push(costForKmRule);

var discountWednesdayRule = {
	"name":"descuento los miercoles",
	"condition": function(R){
		var arrFecha = this.fecha.split('/');
		var fechaViaje = new Date(arrFecha[2], arrFecha[1] - 1, arrFecha[0]);
		var dia = weekdays[ fechaViaje.getDay() ];
		console.log(dia);
		R.when(this && dia == 'miercoles')
	},
	"consequence": function(R){
		this.discount -= 0.05;
		R.stop();
	}
}

//rules.push(discountWednesdayRule);

var chargeMondaysRule = {
	"name":"recargo por ser lunes",
	"condition": function(R){
		var arrFecha = this.fecha.split('/');
		var fechaViaje = new Date(arrFecha[2], arrFecha[1] - 1, arrFecha[0]);
		var dia = weekdays[ fechaViaje.getDay() ];
		R.when(this && dia == 'lunes')
	},
	"consequence": function(R){
		this.discount += 0.10;
		R.stop();
	}
}

//rules.push(chargeMondaysRule);

var firstTripRule = {
	"name": "descuento de $100 por ser el primer viaje",
	"condition" : function(R){
		R.when(this && this.cantViajes == 0);
	},
	"consequence" : function(R){
		if( this.costo >= 100) this.costo -= 100;
		else this.costo = 0;
		R.stop();
	}
}

//rules.push(firstTripRule);

var totalTripsRule = {
	"name" : "Recargo de 15% si hubo mas de 10 viajes en los ultimos 30 min",
	"condition" : function(R){
		R.when(this && this.totalTrips > 10);
	},
	"consequence" : function(R){
		this.discount += 0.15;
		R.stop();
	}
}

//rules.push(totalTripsRule);

var ownDailyTRipsRule = {
	"name" : "Descuento de 5% a partir del 5to viaje en el dia",
	"condition" : function(R){
		R.when(this && this.ownDailyTrips > 4);
	},
	"consequence" : function(R){
		this.discount -= 0.05;
		R.stop();
	}
}

//rules.push(ownDailyTRipsRule);

var fact = {
    "distance": 10,
    "mail":"gustavo@llevame.com",
		"fecha": "20/12/2017",
		"cost": 0,
		"discount": 1,
		"tripOk": true,
		"ownDailyTrips": 10,
		"totalTrips": 30
};

var RuleDomain = new RuleEngine(domainRule);
var RuleMinCost = new RuleEngine(minCostRule);
var RuleCostKm = new RuleEngine(costForKmRule);
var RuleDiscWednesday = new RuleEngine(discountWednesdayRule);
var RuleCostForKm = new RuleEngine(costForKmRule);
var RuleArray = new RuleEngine(oneRules, {ignoreFactChanges : true});

rules.push(RuleDomain);
rules.push(RuleMinCost);
rules.push(RuleCostKm);
rules.push(RuleDiscWednesday);
rules.push(RuleCostForKm);

RuleArray.execute(fact,function(result){
	console.log(result);
});

var otherFact = {
	"distance": 15,
  "mail":"gustavo@gmail.com",
	"fecha": "01/11/2017",
	"cost":0,
	"discount" : 1,
	"tripOk": true,
	"ownDailyTrips": 10,
	"totalTrips": 30,
	"cantViajes": 1
}

RuleArray.execute(otherFact, function(result){
	console.log(result);
	if( result.tripOk == true){
		console.log('Costo final: ' + result.cost * result.discount)
	}else{
		console.log('Viaje rechazado');
	}
});

module.exports = RuleArray;
