module.exports = function(server){

  var logger = require('../config/herokuLogger.js')
  var databaseObject = require('../models/businessUserDB.js')

  server.get("/business-users", function( req, res, err ){
    logger.info('Solicitud de obtencion de todos los usuarios de negocio');
    var results = [];
    databaseObject.prototype.getAllBU( res, results );
  });

  server.post("/business-users", function( req, res, err ){
    logger.info('Solicitud de creacion de un usuario de negocio');
    databaseObject.prototype.createBU(res, req.body.username, req.body.password, req.body.name, req.body.surname, req.body.role);
  });

  server.post("/login", function( req, res, err ){
    logger.info('Solicitud de inicio de sesion');
    var session;
    databaseObject.prototype.checkAuth( res, req, session );
  });

  server.get("/business-users/me", function( req, res, err ){
    logger.info('Solicitud de informacion personal');

    if( !req.session.authenticated ){
      logger.info('Unauthorized');
      res.status(401).send('Unauthorized');
    }else {
      databaseObject.prototype.getPersonalInfo( res, req );
    }
  });

  server.put("/business-users/me", function( req, res, err ){
    logger.info('Solicitud de actualizacion de informacion personal');

    if( !req.session.authenticated ){
      logger.info("Unauthorized");
      res.status(401).send('Unauthorized');
    }else{
      databaseObject.prototype.updateInfo( res, req );
    }

  });

};
