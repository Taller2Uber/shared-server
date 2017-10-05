module.exports = function(server){

  var logger = require('../config/herokuLogger.js');
  var appserverDB = require('../models/appserversDB');
  var randtoken = require('rand-token');


  server.get("/servers", function( req, res, err ){
    logger.info('Solicitud de obtener todos los appservers');
    var results = [];
    appserverDB.prototype.getAllServers(res, results);
  });

  server.post("/servers", function( req, res, err ){
    logger.info('Solicitud de alta de appserver')
    var token = randtoken.generate(32);
    appserverDB.prototype.createServer(res, req.body.name, token );
  });

  server.delete("/servers/:userId", function( req, res, err ){
    logger.info('Solicitud de baja de appserver')
    appserverDB.prototype.deleteServer(res, req.params.userId, req.body.token);
  });

  server.get("/servers/:userId", function( req, res, err ){
    logger.info('Solicitud de informacion de un appserver');
    appserverDB.getServerInfo( res, req.params.userId);
  });

    server.put("/servers/:userId", function( req, res, err ){
      logger.info('Solicitud de modificacion de un appserver');
      appserverDB.updateServerInfo(res, req, req.params.userId);
    });

    server.post("/servers/:userId", function( req, res, err ){
      logger.info('Solicitud de renovacion de token de un appserver');
      var newToken = randtoken.generate(32);
      appserverDB.renewToken( res, newToken, req.body._ref, req.params.userId );
    });

    server.get("/servers/ping", function( req, res, err ){
      logger.info('Solicitud de notificacion de vida del servidor');
      });
};
