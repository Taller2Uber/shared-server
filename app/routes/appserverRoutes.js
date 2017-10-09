var logger = require('../config/herokuLogger.js');
var appserverDB = require('../models/appserversDB');
var randtoken = require('rand-token');

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
  server.get("/servers", function( req, res, err ){
    logger.info('Solicitud de obtener todos los appservers');
    var results = [];
    appserverDB.prototype.getAllServers(res, results);
  });


  /**
   * @name post(/servers)
   * @description dar de alta un appserver.
   * @memberof appServerRoutes
   * @function POST servers
   * @param request object
   * @param results object
   * @param error object
   */
  server.post("/servers", function( req, res, err ){
    logger.info('Solicitud de alta de appserver')
    var token = randtoken.generate(32);
    appserverDB.prototype.createServer(res, req.body.name, token );
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
  server.delete("/servers/:userId", function( req, res, err ){
    logger.info('Solicitud de baja de appserver')
    appserverDB.prototype.deleteServer(res, req.params.userId, req.body.token);
  });

  /**
   * @name geT(/servers/:serverId)
   * @description obtener un appserver.
   * @memberof appServerRoutes
   * @function GET server
   * @param request object
   * @param results object
   * @param error object
   */
  server.get("/servers/:userId", function( req, res, err ){
    logger.info('Solicitud de informacion de un appserver');
    appserverDB.getServerInfo( res, req.params.userId);
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
    server.put("/servers/:userId", function( req, res, err ){
      logger.info('Solicitud de modificacion de un appserver');
      appserverDB.updateServerInfo(res, req, req.params.userId);
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
    server.post("/servers/:userId", function( req, res, err ){
      logger.info('Solicitud de renovacion de token de un appserver');
      var newToken = randtoken.generate(32);
      appserverDB.renewToken( res, newToken, req.body._ref, req.params.userId );
    });

    server.get("/servers/ping", function( req, res, err ){
      logger.info('Solicitud de notificacion de vida del servidor');
      });

};

module.exports = appServerRoutes;
