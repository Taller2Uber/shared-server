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

};
