const connect = require('../config/pgdb')
var refCheck = require('./refCheck')
var respuesta = require('./respuesta')
var async = require('asyncawait/async')
var await = require('asyncawait/await')
var logger = require('../config/herokuLogger')
var refHash = require('./refCheck')
var ruleFacts = require('./ruleFacts')
var transactionDB = require('./transactionDB')

function tripsDB(){}

tripsDB.create = function( req, response, serverId ){
  var respuestaJson = {};
  var trip = req.body.trip;
  if(  !req.body.trip ||  !trip.start || !trip.end || !trip.cost || trip.totalTime < 0 || trip.waitTime < 0 || trip.travelTime < 0 || trip.distance < 0 || trip.route < 0 ||
      !req.body.paymethod || !trip.driver || !trip.passenger ){
        logger.error('Incumplimiento de precondiciones');
        response.status(400).json(respuesta.addError(respuestaJson, 400, 'Incumplimiento de precondiciones (parametros faltantes)'));
      }else{
        connect().query('INSERT INTO trips (cost, applicationOwner, driver, passenger, paymethod, route, totalTime, travelTime, waitTime, distance, start, "end") VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12) RETURNING *',
          [ JSON.stringify(trip.cost), serverId, trip.driver, trip.passenger, JSON.stringify(req.body.paymethod), JSON.stringify(trip.route), trip.totalTime, trip.travelTime, trip.waitTime, trip.distance, JSON.stringify(trip.start), JSON.stringify(trip.end) ],(err, res)=>{
          if(err){
            logger.error('Unexpected error: ' + err)
            response.status(500).json(respuesta.addError(respuestaJson, 500, 'Unexpected error'));
          }else{
            logger.info('Alta correcta');
            respuestaJson = respuesta.addResult(respuestaJson, 'Trip', res.rows[0]);
            respuestaJson = respuesta.addEntityMetadata(respuestaJson);
            transactionDB.addCost(req.body.trip.passenger, req.body.trip.cost.currency, - req.body.trip.cost.value, response);
            response.status(201).json(respuestaJson);
          }
          })
    }
}

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
        respuestaJson = respuesta.addResult(respuestaJson, 'trips', results);
        respuestaJson = respuesta.addCollectionMetadata(respuestaJson, results);
        response.status(200).json(respuestaJson);
      }
    })
}

tripsDB.estimate = function(req, response){
  var respuestaJson = {};
  if( !req.body.start || !req.body.end || !req.body.passenger ){
    logger.error('Incumplimiento de precondiciones');
    response.status(400).json(respuesta.addError(respuestaJson, 400, 'Incumplimiento de precondiciones'));
  }else{
      var startAddress = JSON.parse(JSON.stringify(req.body.start.address));
      var endAddress = JSON.parse(JSON.stringify(req.body.end.address));
      var cost = JSON.parse(JSON.stringify(req.body.cost));
      ruleFacts.getEstimateFact( startAddress, endAddress, function(result){
        if(result.tripOk == true){
          console.log('Ok')
          var cost = {}
          cost.value = result.cost * result.discount;
          cost.currency = req.body.cost.currency;
          respuestaJson = respuesta.addEntityMetadata(respuestaJson);
          respuestaJson = respuesta.addResult(respuestaJson, 'cost', cost);
          response.status(200).json(respuestaJson);
        }else{
          console.log('Rechazado')
          respuestaJson = respuesta.addError(respuestaJson, 402, 'Viaje rechazado');
          response.status(402).json(respuestaJson);
        }
      });
  }
}


module.exports = tripsDB;
