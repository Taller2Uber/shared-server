const connect = require('../config/pgdb')
var refCheck = require('./refCheck')
var respuesta = require('./respuesta')
var async = require('asyncawait/async')
var await = require('asyncawait/await')
var logger = require('../config/herokuLogger')
var refHash = require('./refCheck')
var ruleFacts = require('./ruleFacts')
var transactionDB = require('./transactionDB')
var paymentsDB = require('./payments')

/**
 * @class Clase para manejar la base de datos de viajes
 */

function tripsDB(){}

/**
* @name create
* @function createTrip
* @memberof tripsDB
* @author Gustavo Adrian Gimenez
* @param response Objeto por el cual se realiza la devolucion a la llamada
* @param serverId id del appserver que esta dando de alta el viaje
* @param req Objeto que contiene informacion de la llamada del cliente a la api
*/

tripsDB.create = function( req, response, serverId ){
  var respuestaJson = {};
  var trip = req.body.trip;
  if(  !req.body.trip ||  !trip.start || !trip.end || !trip.cost || trip.totalTime < 0 || trip.waitTime < 0 || trip.travelTime < 0 || trip.distance < 0 || trip.route < 0 ||
      !req.body.paymethod || !trip.driver || !trip.passenger ){
        logger.error('Incumplimiento de precondiciones');
        response.status(400).json(respuesta.addError(respuestaJson, 400, 'Incumplimiento de precondiciones (parametros faltantes)'));
      }else{
        connect().query('INSERT INTO trips (cost, applicationOwner, driver, passenger, paymethod, route, totalTime, travelTime, waitTime, distance, start, "end", createdtime) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, CURRENT_TIMESTAMP) RETURNING *',
          [ JSON.stringify(trip.cost), serverId, trip.driver, trip.passenger, JSON.stringify(req.body.paymethod), JSON.stringify(trip.route), trip.totalTime, trip.travelTime, trip.waitTime, trip.distance, JSON.stringify(trip.start), JSON.stringify(trip.end)],(err, res)=>{
          if(err){
            logger.error('Unexpected error: ' + err)
            response.status(500).json(respuesta.addError(respuestaJson, 500, 'Unexpected error'));
          }else{
            var startAddress = JSON.parse(JSON.stringify(req.body.trip.start.address));
            var endAddress = JSON.parse(JSON.stringify(req.body.trip.end.address));
            var cost = JSON.parse(JSON.stringify(req.body.trip.cost));
            var passenger = {}
            var driver = {}
            var fact = {}

            tripsDB.getTotalNumberOfTrips(req.body.trip.driver,  function(result){
              driver = result;
              tripsDB.getTotalNumberOfTrips(req.body.trip.passenger, function(resu){
                passenger = resu;
                tripsDB.getBalanceFromUser(req.body.trip.passenger, req.body.trip.cost.currency, function(balance){
                  passenger.balance = balance;
                  tripsDB.getLastGeneralTrips(function(fromLastHour, fromLastHalf, fromLastTen){
                    fact.lastHour = fromLastHour;
                    fact.lastHalf = fromLastHalf;
                    fact.lastTen = fromLastTen;
                    if(req.body.paymethod){
                      fact.paymethod = req.body.paymethod.paymethod;
                    }
                    fact.fecha = new Date().getTime();
                    fact.waitTime = req.body.trip.waitTime;
                    fact.travelTime = req.body.trip.travelTime;
                    fact.passenger = passenger;
                    fact.driver = driver;
                      ruleFacts.getEstimateFact(startAddress, endAddress, balance, fact, function(resultado){
                        if(resultado.tripOk == true){
                          cost.value = resultado.cost;
                          logger.info('Alta correcta');
                          res.rows[0].cost.value = cost.value;
                          respuestaJson = respuesta.addResult(respuestaJson, 'Trip', res.rows[0]);
                          respuestaJson = respuesta.addEntityMetadata(respuestaJson);
                          var jsonPay = {};
                          createJsonPayment(req, function(jsonPay){
                            paymentsDB.makePay(jsonPay, function(result){
                              if( !result ){
                                transactionDB.addCost(req.body.trip.passenger, req.body.trip.cost.currency, - req.body.trip.cost.value, response);
                                transactionDB.addCost(req.body.trip.driver, req.body.trip.cost.currency, req.body.trip.cost.value, response);
                              }
                            })
                            response.status(201).json(respuestaJson);
                          })
                        }
                      })
                    })
                  })
                })
              })
          }
        })
    }
}

createJsonPayment = function( req, callback ){
  var jsonPayment = {};
  jsonPayment.transaction_id = null;
  jsonPayment.currency = req.body.trip.cost.currency;
  jsonPayment.value = req.body.trip.cost.value;
  jsonPayment.paymentMethod = req.body.paymethod.parameters;
  callback(jsonPayment);
}

/**
* @name getAll
* @function getAllTrips
* @memberof tripsDB
* @author Gustavo Adrian Gimenez
* @param response Objeto por el cual se realiza la devolucion a la llamada
* @param request Objeto que contiene informacion de la llamada realizada por el cliente a la api
*/

tripsDB.getAll = function( req, response ){
  var respuestaJson = {};
  var results = [];
  connect().query('SELECT * FROM trips', (err, res)=>{
      if(err){
          logger.error('Unexpected error');
          response.status(500).json(respuesta.addError(respuestaJson, 500, 'Unexpected error'));
      }else{
        res.rows.forEach(row =>{
          results.push(row);
        })
        logger.info('Obtencion de todos los viajes');
        respuestaJson = respuesta.addResult(respuestaJson, 'trips', results);
        respuestaJson = respuesta.addCollectionMetadata(respuestaJson, results);
        response.status(200).json(respuestaJson);
      }
    })
}

/**
* @name getOne
* @function getOneTrip
* @memberof tripsDB
* @author Gustavo Adrian Gimenez
* @param response Objeto por el cual se realiza la devolucion a la llamada
* @param request Objeto que contiene informacion de la llamada realizada por el cliente a la api
*/

tripsDB.getOne = function( req, response ){
  var respuestaJson = {};
  var results = [];
    connect().query('SELECT * FROM trips WHERE id = $1', [req.params.tripId], (err, res)=>{
        if(err){
          logger.error('Unexpected error: ' + err);
          response.status(500).json(respuesta.addError(respuestaJson, 500, 'Unexpected error'));
        }else{
          logger.info('Obtencion de un viaje');
          respuestaJson = respuesta.addResult(respuestaJson, 'trip', res.rows[0]);
          respuestaJson = respuesta.addEntityMetadata(respuestaJson);
          response.status(200).json(respuestaJson);
        }
      })
}

/**
* @name getTripsFromUser
* @function getTripsFromUser
* @memberof tripsDB
* @author Gustavo Adrian Gimenez
* @param response Objeto por el cual se realiza la devolucion a la llamada
* @param request Objeto que contiene informacion de la llamada realizada por el cliente a la api
*/

tripsDB.getTripsFromUser = function(req, response){
  var respuestaJson = {};
  var results = [];
  connect().query('SELECT * FROM trips WHERE (passenger = $1 OR driver = $1)',[req.params.userId], (err, res)=>{
      if(err){
          logger.error('Unexpected error');
          response.status(500).json(respuesta.addError(respuestaJson, 500, 'Unexpected error'));
      }else{
        res.rows.forEach(row =>{
          results.push(row);
        })
        logger.info('Obtencion de todos los viajes');
        logger.info(results.length)
        respuestaJson = respuesta.addResult(respuestaJson, 'trips', results);
        respuestaJson = respuesta.addCollectionMetadata(respuestaJson, results);
        response.status(200).json(respuestaJson);
      }
    })
}

tripsDB.getTripsFromServer = function(req, response){
  var respuestaJson = {};
  var results = [];
  connect().query('SELECT * FROM trips WHERE applicationOwner = $1',[req.params.serverId], (err, res)=>{
      if(err){
          logger.error('Unexpected error');
          response.status(500).json(respuesta.addError(respuestaJson, 500, 'Unexpected error'));
      }else{
        res.rows.forEach(row =>{
          results.push(row);
        })
        logger.info('Obtencion de todos los viajes');
        logger.info(results.length)
        respuestaJson = respuesta.addResult(respuestaJson, 'trips', results);
        respuestaJson = respuesta.addCollectionMetadata(respuestaJson, results);
        response.status(200).json(respuestaJson);
      }
    })
}


tripsDB.getTotalTrips = function(results, callback){
  callback(results.length)
}


tripsDB.getLastTenTrips = function(results, callback){
  var tripsOfLastTenMinutes = 0;
  for( var trip of results ){
    var tenBefore = new Date()
    tenBefore.setMinutes( tenBefore.getMinutes() - 10 );
    var now = new Date();
    if(trip.start.timestamp >= tenBefore.getTime() && trip.start.timestamp <= now.getTime()){
      tripsOfLastTenMinutes += 1;
    }
  }
  callback(tripsOfLastTenMinutes)
}

tripsDB.getLastHalfTrips = function(results, callback){
  var tripsOfLastHalf = 0;
  for( var trip of results ){
    var halfBefore = new Date()
    halfBefore.setMinutes( halfBefore.getMinutes() - 30 );
    var now = new Date();
    if(trip.start.timestamp >= halfBefore.getTime() && trip.start.timestamp <= now.getTime()){
      tripsOfLastHalf += 1;
    }
  }
  callback(tripsOfLastHalf)
}

tripsDB.getTotalNumberOfTrips = function(userId, callback){
  var respuestaJson = {};
  var results = [];
  var tripsOfLastTenMinutes = 0;
  var lastHalfTrips = 0;
  connect().query('SELECT * FROM trips WHERE (passenger = $1 OR driver = $1)',[userId], (err, res)=>{
      if(err){
          logger.error('Unexpected error: ' + err);
          callback(null);
      }else{
        res.rows.forEach(row =>{
          results.push(row);
        })
        this.getTotalTrips(results, function( totalTrips ){
          respuestaJson.totalTrips = totalTrips;
        })

        this.getLastTenTrips(results, function( tripsOfLastTenMinutes ){
          respuestaJson.lastTen = tripsOfLastTenMinutes;
        })

        this.getLastHalfTrips(results, function(lastHalfTrips){
          respuestaJson.lastHalf = lastHalfTrips;
        })
        callback(respuestaJson)
      }
    })
}

tripsDB.getBalanceFromUser = function(userId, currency, callback){
  var respuestaJson = {};
  var balance = [];
  var negativeBalance = false;
    connect().query('SELECT balance FROM users WHERE id = $1', [userId], (err, res)=>{
        if(err){
          logger.error('Unexpected error: ' + err);
          callback(null);
        }else{
          logger.info('Obtencion de un viaje');
          if( res.rows[0].balance ){
            balance = res.rows[0].balance;
          }else{
            balance = [];
          }
          for( var balanceItem of balance ){
            if( balanceItem.currency == currency ){
              if(balanceItem.value < 0){
                negativeBalance = true;
              }
            }
          }
          if( negativeBalance == true ){
            callback(-1);
          }else{
            callback(1);
          }
        }
      })
}

tripsDB.getLastGeneralTrips = function(callback){
  var respuestaJson = {};
  var results = [];
  var tripsOfLastTenMinutes = 0;
  var lastHalfTrips = 0;
  var timestampLastHour = new Date()
  timestampLastHour.setMinutes( timestampLastHour.getMinutes() - 60 );
  var timestampLastHalf = new Date()
  timestampLastHalf.setMinutes( timestampLastHalf.getMinutes() - 30 );
  var timestampLastTen = new Date()
  timestampLastTen.setMinutes( timestampLastTen.getMinutes() - 10 );
  connect().query('SELECT * FROM trips WHERE createdtime >= $1',[timestampLastHour], (err, res)=>{
      if(err){
          logger.error('Unexpected error: ' + err);
          callback(null);
      }else{
        res.rows.forEach(row =>{
          results.push(row);
        })

        for(var trip of results){
          if(trip.createdtime >= timestampLastTen){
            tripsOfLastTenMinutes += 1;
          }

          if(trip.createdtime >= timestampLastHalf){
            lastHalfTrips += 1;
          }
        }
        callback(results.length, lastHalfTrips, tripsOfLastTenMinutes);
      }
    })
}


/**
* @name estimate
* @function estimate
* @memberof tripsDB
* @author Gustavo Adrian Gimenez
* @param response Objeto por el cual se realiza la devolucion a la llamada
* @param request Objeto que contiene informacion de la llamada realizada por el cliente a la api
*/

tripsDB.estimate = function(req, response, serverId){
  var respuestaJson = {};
  if( !req.body.start || !req.body.end || !req.body.passenger ){
    logger.error('Incumplimiento de precondiciones');
    response.status(400).json(respuesta.addError(respuestaJson, 400, 'Incumplimiento de precondiciones'));
  }else{
    var startAddress = JSON.parse(JSON.stringify(req.body.start.address));
    var endAddress = JSON.parse(JSON.stringify(req.body.end.address));
    var cost = JSON.parse(JSON.stringify(req.body.cost));
    var passenger = {}
    var driver = {}
    var fact = {}

    tripsDB.getTotalNumberOfTrips(req.body.driver,  function(result){
      driver = result;
      tripsDB.getTotalNumberOfTrips(req.body.passenger, function(resu){
        passenger = resu;
        tripsDB.getBalanceFromUser(req.body.passenger, req.body.cost.currency, function(balance){
          passenger.balance = balance;
          tripsDB.getLastGeneralTrips(function(fromLastHour, fromLastHalf, fromLastTen){
            fact.lastHour = fromLastHour;
            fact.lastHalf = fromLastHalf;
            fact.lastTen = fromLastTen;
            if(req.body.paymethod){
              fact.paymethod = req.body.paymethod.paymethod;
            }
            fact.fecha = new Date().getTime();
            fact.waitTime = req.body.waitTime;
            fact.travelTime = req.body.travelTime;
            fact.passenger = passenger;
            fact.driver = driver;
              ruleFacts.getEstimateFact(startAddress, endAddress, balance, fact, function(resultado){
                if(resultado.tripOk == true){
                  var cost = {}
                  cost.value = resultado.cost * resultado.discount;
                  cost.currency = req.body.cost.currency;
                  cost.appserver = serverId;
                  respuestaJson = respuesta.addEntityMetadata(respuestaJson);
                  respuestaJson = respuesta.addResult(respuestaJson, 'cost', cost);
                  response.status(200).json(respuestaJson);
                }else{
                  respuestaJson = respuesta.addError(respuestaJson, 402, 'Viaje rechazado');
                  response.status(402).json(respuestaJson);
                }
              });
          })
        })
      })
    })
  }
}

tripsDB.getLastTrips = function(req, response){
  var respuestaJson = {}
  var results = [];
  connect().query('SELECT * FROM trips ORDER BY createdtime DESC LIMIT $1', [req.body.numberOfTrips], (err, res)=>{
      if(err){
          logger.error('Unexpected error');
          response.status(500).json(respuesta.addError(respuestaJson, 500, 'Unexpected error'));
      }else{
        res.rows.forEach(row =>{
          results.push(row);
        })
        logger.info('Obtencion de todos los viajes');
        respuestaJson = respuesta.addResult(respuestaJson, 'trips', results);
        respuestaJson = respuesta.addCollectionMetadata(respuestaJson, results);
        response.status(200).json(respuestaJson);
      }
    })
}

module.exports = tripsDB;
