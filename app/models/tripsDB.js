const pg  = require('pg')
const db = require('../config/pgdb')
var refCheck = require('./refCheck')
var respuesta = require('./respuesta')
var async = require('asyncawait/async')
var await = require('asyncawait/await')
var logger = require('../config/herokuLogger')
var Pool = require('pg-pool')
var refHash = require('./refCheck')

function tripsDB(){}

tripsDB.create = function( req, response ){
  var respuestaJson = {};
  var trip = req.body.trip;
  if(  !req.body.trip ||  !trip.start || !trip.end || !trip.cost || trip.totalTime < 0 || trip.waitTime < 0 || trip.travelTime < 0 || trip.distance < 0 || trip.route < 0 ||
      !req.body.paymethod || !trip.applicationOwner || !trip.driver || !trip.passenger ){
        logger.error('Incumplimiento de precondiciones');
        response.status(400).json(respuesta.addError(respuestaJson, 400, 'Incumplimiento de precondiciones (parametros faltantes)'));
      }else{
        const pool = new Pool(db.configDB);
        pool.connect().then(client =>{
          client.query('INSERT INTO trips (cost, applicationOwner, driver, passenger, paymethod, route, totalTime, travelTime, waitTime, distance, start, "end") VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12) RETURNING *',
          [ JSON.stringify(trip.cost), trip.applicationOwner, trip.driver, trip.passenger, JSON.stringify(req.body.paymethod), JSON.stringify(trip.route), trip.totalTime, trip.travelTime, trip.waitTime, trip.distance, JSON.stringify(trip.start), JSON.stringify(trip.end) ],(err, res)=>{
          if(err){
            logger.error('Unexpected error: ' + err)
            response.status(500).json(respuesta.addError(respuestaJson, 500, 'Unexpected error'));
          }else{
            logger.info('Alta correcta');
            respuestaJson = respuesta.addResult(respuestaJson, 'Trip', res);
            respuestaJson = respuesta.addEntityMetadata(respuestaJson);
            response.status(201).json(respuestaJson);
          }
          })
        })
        .catch(e=>{
          logger.error('Unexpected error: ' + e);
          respuestaJson = respuesta.addError(respuestaJson, 500, 'Unexpected error');
          response.status(500).json(respuestaJson);
        })
    }
}

tripsDB.getAll = function( req, response ){
  var respuestaJson = {};
  var results = [];
  const pool = new Pool(db.configDB);
  pool.connect().then(client =>{
    client.query('SELECT * FROM trips', (err, res)=>{
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
  }).catch(e =>{
    logger.error('Unexpected error: ' + e);
    response.status(500).json(respuesta.addError(respuestaJson, 500, 'Unexpected error'));
  })
}

tripsDB.getOne = function( req, response ){
  var respuestaJson = {};
  var results = [];

  const pool = new Pool(db.configDB);
  pool.connect().then(client =>{
      client.query('SELECT * FROM trips WHERE id = $1', [req.params.tripId], (err, res)=>{
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
  }).catch(e =>{
    logger.error('Unexpected error: '+ e);
    response.status(500).json(respuesta.addError(respuestaJson, 500, 'Unexpected error'));
  })
}

tripsDB.getTripsFromUser = function(req, response){
  var respuestaJson = {};
  var results = [];
  const pool = new Pool(db.configDB);
  pool.connect().then(client =>{
    client.query('SELECT * FROM trips WHERE (passenger = $1 OR driver = $1)',[req.params.userId], (err, res)=>{
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
  }).catch(e =>{
    logger.error('Unexpected error: ' + e);
    response.status(500).json(respuesta.addError(respuestaJson, 500, 'Unexpected error'));
  })
}

tripsDB.estimate = function(req, response){
  var respuestaJson = {};
  if( !req.body.start || !req.body.end || !req.body.passenger ){
    logger.error('Incumplimiento de precondiciones');
    response.status(400).json(respuesta.addError(respuestaJson, 400, 'Incumplimiento de precondiciones'));
  }else{
    const pool = new Pool(db.configDB);
    pool.connect().then(client =>{
      distanceInKm( req.body.start.address.lat, req.body.start.address.lon, req.body.end.address.lon, req.body.start.address.lat, function(resultado){
        logger.info(resultado);
      })
    }).catch(e =>{
      logger.error('Unexpected error: ' + e);
      response.status(500).json(respuesta.addError(respuestaJson, 500, 'Unexpected error'));
    })
  }
}

distanceInKm = function(lat1, lon1, lat2, lon2, callback){
  var R = 6371; // Radio terresetre
  var dLat = deg2rad(lat2-lat1);
  var dLon = deg2rad(lon2-lon1);
  console.log(lon1);
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

module.exports = tripsDB;
