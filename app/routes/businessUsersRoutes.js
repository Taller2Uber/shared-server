var respuesta = require('../models/respuesta')
var loginCheck = require('../models/loginCheck')

module.exports = function(server){

  var logger = require('../config/herokuLogger.js')
  var databaseObject = require('../models/businessUserDB.js')

server.get("/business-users", function( req, res, err ){
    logger.info('Solicitud de obtencion de todos los usuarios de negocio');

    if( loginCheck.check(req, res) == true ){
      var results = [];
      databaseObject.prototype.getAllBU( res, results );
    }

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

    var respuestaJson = {};
    if(loginCheck.check(req, res) == true){
      databaseObject.prototype.getPersonalInfo( res, req, req.session.userId );
    }

  });

server.put("/business-users/me", function( req, res, err ){
    logger.info('Solicitud de actualizacion de informacion personal');

    if(loginCheck.check(req, res) == true){
      databaseObject.prototype.updateInfo( res, req, req.session.userId );
    }

  });

server.delete("/business-users/:userId", function( req, res, err ){
    logger.info('Solicitud de borrado de usuario: ' + req.params.userId);
    var respuestaJson = {};
    if( req.session.role != 'admin' ){
      logger.info('Unauthorized');
      respuestaJson = respuesta.addError(respuestaJson, 401, 'Unauthorized');
      res.status(401).json(respuestaJson);
    }else{
      databaseObject.prototype.delete( res, req );
    }
  });

server.get("/business-users/:userId", function( req, res, err ){
    logger.info('Solicitud de obtencion de usuario Id: ' + req.params.userId);

    if( req.session.role != 'admin' ){
      logger.info('Unauthorized');
      res.status(401).send('Unauthorized');
    }else{
      databaseObject.prototype.getPersonalInfo( res, req, req.params.userId );
    }

  });

server.put("/business-users/:userId", function( req, res, err ){
    logger.info('Solicitud de actualizacion de informacion del usuario Id: ' + req.params.userId);
    if( req.session.role != 'admin' ){
      logger.info('Unauthorized');
      res.status(401).send('Unauthorized');
    }else{
      databaseObject.prototype.updateInfo( res, req, req.params.userId );
      }

  });

}
