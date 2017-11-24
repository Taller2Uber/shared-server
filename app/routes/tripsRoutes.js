var respuesta = require('../models/respuesta')
var loginCheck = require('../models/loginCheck')
var path = require('path')
var logger = require('../config/herokuLogger.js')
var tripDB = require('../models/tripsDB')
var tokenGenerator = require('../models/tokenGenerator');


/**
 * @namespace tripsRoutes
 */

/**
 * @constructor
 * @param {Object} server Servidor express.
 */

tripsRoutes = function(server){

  /**
   * @name get(/trips)
   * @description obtener todos los viajes.
   * @memberof tripsRoutes
   * @function GET trips
   * @param request object
   * @param results object
   * @param error object
   */

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


  /**
   * @name get(/trips/:tripId)
   * @description obtener un viaje en particular.
   * @memberof tripsRoutes
   * @function GET trips
   * @param request object
   * @param results object
   * @param error object
   */

  server.get('/api/trips/:tripId', function(req, res, err){
    respuestaJson = {}
    logger.info('Obtener un viaje en particular');
    loginCheck.check( req.headers.token, ['user'],  function(authorized){
        if(authorized){
          tripDB.getOne( req, res );
        }else{
          res.status(401).json(respuesta.addError(respuestaJson, 401, 'Unauthorized'));
        }
    })
  })

  server.post('/api/tripsInterval/:tripId', function(req, res, err){

    tripDB.getNumberTripsInTimeInterval( req.params.tripId, req.body.start, req.body.end, function(result){
        logger.info(result);
    })

  })

  server.get('/api/balance/:userId', function(req, res, err){

    tripDB.getBalanceFromUser( req.params.userId, 'ARG', function(result){
        logger.info(result);
    })

  })

  /**
   * @name post(/trips)
   * @description dar de alta un viaje.
   * @memberof tripsRoutes
   * @function POST trips
   * @param request object
   * @param results object
   * @param error object
   */

  server.post('/api/trips', function(req, res, err){
    var respuestaJson = {};
    logger.info('Solicitud para dar de alta un viaje');

    loginCheck.check( req.headers.token, [],  function(authorized, serverJson){
        if(authorized){
          tripDB.create( req, res, serverJson.id );
        }else{
          res.status(401).json(respuesta.addError(respuestaJson, 401, 'Unauthorized'));
        }
    })
  })

  /**
   * @name post(/trips/estimate)
   * @description estimar el costo de un viaje.
   * @memberof tripsRoutes
   * @function POST trips/estimate
   * @param request object
   * @param results object
   * @param error object
   */

  server.post('/api/trips/estimate', function(req, res, err){
    logger.info('Solicitud para estimar el costo de un viaje');

    loginCheck.check(req.headers.token, [], function(authorized, serverJson){
      if(authorized){
        tripDB.estimate(req, res, serverJson.id);
      }else{
        res.status(401).json(respuesta.addError(respuestaJson, 401, 'Unauthorized'));
      }
    })

  })

  server.post('/api/trips/lasttrips', function(req, res, err){
    logger.info('Solicitud para obtener los ultimos viajes creados')

    tokenGenerator.checkBU( req.headers.token, ['user'],  function(authorized){
        if(authorized){
          tripDB.getLastTrips(req, res);
        }else{
          res.status(401).json(respuesta.addError(respuestaJson, 401, 'Unauthorized'));
        }
    })
  })

  server.get('/totalTrips/:userId', function(req, res, err){
    tripDB.getTotalNumberOfTrips( req.params.userId, function(resultado){
        res.status(200).json(resultado);
    })
  })

}





module.exports = tripsRoutes;
