var respuesta = require('../models/respuesta')
var loginCheck = require('../models/loginCheck')
var path = require('path')
var logger = require('../config/herokuLogger.js')
var tripDB = require('../models/tripsDB')
var tokenGenerator = require('../models/tokenGenerator');

tripsRoutes = function(server){

  server.get('/api/trips', function(req, res, err){
    var respuestaJson = {}
    logger.info('Obtener todos los viajes');

    tokenGenerator.checkBU( req.headers.token, ['user'],  function(authorized){
        if(authorized){
          tripDB.getAll( req, res );
        }else{
          res.status(401).json(respuesta.addError(respuestaJson, 401, 'Unauthorized'));
        }
    })
  })

  server.get('/api/trips/:tripId', function(req, res, err){
    logger.info('Obtener todos los viajes de un usuario particular');

    loginCheck.check( req.headers.token, ['user'],  function(authorized){
        if(authorized){
          tripDB.getOne( req, res );
        }else{
          res.status(401).json(respuesta.addError(respuestaJson, 401, 'Unauthorized'));
        }
    })
  })

  server.post('/api/trips', function(req, res, err){
    var respuestaJson = {};
    logger.info('Solicitud para dar de alta un viaje');

    loginCheck.check( req.headers.token, [],  function(authorized){
        if(authorized){
          tripDB.create( req, res );
        }else{
          res.status(401).json(respuesta.addError(respuestaJson, 401, 'Unauthorized'));
        }
    })
  })

  server.post('/api/trips/estimate', function(req, res, err){
    logger.info('Solicitud para estimar el costo de un viaje');

    tripDB.estimate(req, res);

  })
}



module.exports = tripsRoutes;
