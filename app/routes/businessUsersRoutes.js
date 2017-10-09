var respuesta = require('../models/respuesta')
var loginCheck = require('../models/loginCheck')
var logger = require('../config/herokuLogger.js')
var databaseObject = require('../models/businessUserDB.js')

/**
 * @namespace businessUsersRoutes
 */

/**
 * @constructor
 * @param {Object} server Servidor express.
 */

businessUsersRoutes = function(server){


  /**
   * @name get(/businessusers)
   * @description obtener todos los usuarios de negocio.
   * @memberof businessUsersRoutes
   * @function GET businessUser
   * @param request object
   * @param results object
   * @param error object
   */
server.get("/business-users", function( req, res, err ){
    logger.info('Solicitud de obtencion de todos los usuarios de negocio');

    if( loginCheck.check(req, res) == true ){
      var results = [];
      databaseObject.prototype.getAllBU( res, results );
    }

  });


  /**
   * @name post(/businessusers)
   * @description dar de alta un usuario de negocio.
   * @memberof businessUsersRoutes
   * @function POST businessUser
   * @param request object
   * @param results object
   * @param error object
   */
server.post("/business-users", function( req, res, err ){
    logger.info('Solicitud de creacion de un usuario de negocio');
    databaseObject.prototype.createBU(res, req.body.username, req.body.password, req.body.name, req.body.surname, req.body.role);
  });


  /**
   * @name post(/login)
   * @description enviar credenciales para loggeo de usuario de negocio.
   * @memberof businessUsersRoutes
   * @function POST businessUserCredentials
   * @param request object
   * @param results object
   * @param error object
   */
server.post("/login", function( req, res, err ){
    logger.info('Solicitud de inicio de sesion');
    var session;
    databaseObject.prototype.checkAuth( res, req, session );
  });


  /**
   * @name get(/businessusers/me)
   * @description obtener informacion personal.
   * @memberof businessUsersRoutes
   * @function GET businessUser
   * @param request object
   * @param results object
   * @param error object
   */
server.get("/business-users/me", function( req, res, err ){
    logger.info('Solicitud de informacion personal');

    var respuestaJson = {};
    if(loginCheck.check(req, res) == true){
      databaseObject.prototype.getPersonalInfo( res, req, req.session.userId );
    }

  });


  /**
   * @name put(/businessusers)
   * @description modificar informacion personal.
   * @memberof businessUsersRoutes
   * @function PUT businessUser
   * @param request object
   * @param results object
   * @param error object
   */
server.put("/business-users/me", function( req, res, err ){
    logger.info('Solicitud de actualizacion de informacion personal');

    if(loginCheck.check(req, res) == true){
      databaseObject.prototype.updateInfo( res, req, req.session.userId );
    }

  });


  /**
   * @name delete(/businessusers/:userId)
   * @description dar de baja un usuario de negocio.
   * @memberof businessUsersRoutes
   * @function DELETE businessUser
   * @param request object
   * @param results object
   * @param error object
   */
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


  /**
   * @name get(/businessusers/:userId)
   * @description obtener informacion de un usuario de negocio.
   * @memberof businessUsersRoutes
   * @function GET businessUser
   * @param request object
   * @param results object
   * @param error object
   */
server.get("/business-users/:userId", function( req, res, err ){
    logger.info('Solicitud de obtencion de usuario Id: ' + req.params.userId);

    if( req.session.role != 'admin' ){
      logger.info('Unauthorized');
      res.status(401).send('Unauthorized');
    }else{
      databaseObject.prototype.getPersonalInfo( res, req, req.params.userId );
    }

  });


  /**
   * @name put(/businessusers/:userId)
   * @description modificar informacion de un usuario de negocio.
   * @memberof businessUsersRoutes
   * @function PUT businessUser
   * @param request object
   * @param results object
   * @param error object
   */
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

module.exports = businessUsersRoutes;

module.exports = businessUsersRoutes;
