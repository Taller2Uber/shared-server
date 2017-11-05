var logger = require('../config/herokuLogger.js');
var appserverDB = require('../models/appserversDB');
var randtoken = require('rand-token');
var tokenGenerator = require('../models/tokenGenerator');
var loginCheck = require('../models/loginCheck')
var respuesta = require('../models/respuesta')

/**
 * @namespace appServerRoutes
 */

/**
 * @constructor
 * @param {Object} server Servidor express.
 */


appServerRoutes = function(server){

  /**
   * @name get(/servers)
   * @description obtener todos los appservers.
   * @memberof appServerRoutes
   * @function GET servers
   * @param request object
   * @param results object
   * @param error object
   */
  server.get("/api/servers", function( req, res, err ){
    logger.info('Solicitud de obtener todos los appservers');
    var respuestaJson = {};
    var results = [];
    tokenGenerator.checkBU( req.headers.token, ['user'], function (isBU){
        if ( isBU == true ){
          appserverDB.getAllServers(res, results);
        }else{
          respuestaJson = respuesta.addError(respuestaJson, 401, 'Unauthorized')
          res.status(401).json(respuestaJson);
        }
    })
  });


  server.post('/api/servers/ping', function(req, res, err){
    var respuestaJson = {}
    if( req.headers.token ){
      loginCheck.serverCheck( req.headers.token , function(result, serverJson){
        if(result === true){
          res.json(serverJson);
        }else{
          respuestaJson = respuesta.addError(respuestaJson, 401, 'Unauthorized');
          res.status(401).json(respuestaJson);
        }
      })
  }else{
    respuestaJson = respuesta.addError(respuestaJson, 400, 'Incumplimiento de precondiciones');
    res.status(400).json(respuestaJson);
  }
  })

  /**
   * @name post(/servers)
   * @description dar de alta un appserver.
   * @memberof appServerRoutes
   * @function POST servers
   * @param request object
   * @param results object
   * @param error object
   */
  server.post("/api/servers", function( req, res, err ){
    respuestaJson = {};
    logger.info('Solicitud de alta de appserver');
    tokenGenerator.checkBU( req.headers.token, ['manager'], function (isBU){
        if ( isBU == true ){
          appserverDB.createServer(res, req.body.name, token );
        }else{
          respuestaJson = respuesta.addError(respuestaJson, 401, 'Unauthorized')
          res.status(401).json(respuestaJson);
        }
    })
  });

  /**
   * @name delete(/servers/:serverId)
   * @description dar de baja un appserver.
   * @memberof appServerRoutes
   * @function DELETE server
   * @param request object
   * @param results object
   * @param error object
   */
  server.delete("/api/servers/:userId", function( req, res, err ){
    var respuestaJson = {};
    logger.info('Solicitud de baja de appserver')
    tokenGenerator.checkBU( req.headers.token, ['manager'], function (isBU){
        if ( isBU == true ){
          appserverDB.deleteServer(res, req.params.userId);
        }else{
          respuestaJson = respuesta.addError(respuestaJson, 401, 'Unauthorized')
          res.status(401).json(respuestaJson);
        }
    })

  });

  /**
   * @name get(/servers/:serverId)
   * @description obtener un appserver.
   * @memberof appServerRoutes
   * @function GET server
   * @param request object
   * @param results object
   * @param error object
   */
  server.get("/api/servers/:userId", function( req, res, err ){
    var respuestaJson = {};
    logger.info('Solicitud de informacion de un appserver');
    tokenGenerator.checkBU( req.headers.token, ['user'], function (isBU){
        if ( isBU == true ){
          appserverDB.getServerInfo( res, req.params.userId);
        }else{
          respuestaJson = respuesta.addError(respuestaJson, 401, 'Unauthorized')
          res.status(401).json(respuestaJson);
        }
    })
  });

  /**
   * @name put(/servers/:serverId)
   * @description modificar la informacion de un appserver.
   * @memberof appServerRoutes
   * @function PUT servers
   * @param request object
   * @param results object
   * @param error object
   */
    server.put("/api/servers/:userId", function( req, res, err ){
      var respuestaJson = {};
      logger.info('Solicitud de modificacion de un appserver');
      tokenGenerator.checkBU( req.headers.token, ['manager'], function (isBU){
          if ( isBU == true ){
            appserverDB.updateServerInfo(res, req, req.params.userId);
          }else{
            respuestaJson = respuesta.addError(respuestaJson, 401, 'Unauthorized')
            res.status(401).json(respuestaJson);
          }
      })
    });

    /**
     * @name post(/servers/:serverId)
     * @description renovacion de token para un appserver.
     * @memberof appServerRoutes
     * @function POST server
     * @param request object
     * @param results object
     * @param error object
     */
    /*server.post("/api/servers/:userId", function( req, res, err ){
      var respuestaJson = {};
      logger.info('Solicitud de renovacion de token de un appserver');
      tokenGenerator.checkBU( req.headers.token, ['manager'], function (isBU){
          if ( isBU == true ){
            appserverDB.renewToken( res, req.body._ref, req.params.userId );
          }else{
            respuestaJson = respuesta.addError(respuestaJson, 401, 'Unauthorized')
            res.status(401).json(respuestaJson);
          }
      })
    }); */
};

module.exports = appServerRoutes;
