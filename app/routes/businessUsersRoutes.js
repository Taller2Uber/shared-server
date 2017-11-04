var respuesta = require('../models/respuesta')
var loginCheck = require('../models/loginCheck')
var logger = require('../config/herokuLogger.js')
var databaseObject = require('../models/businessUserDB.js')
var randtoken = require('rand-token')
var tokenGenerator = require('../models/tokenGenerator')

/**
 * @namespace businessUsersRoutes
 */

/**
 * @constructor
 * @param {Object} server Servidor express.
 */

businessUsersRoutes = function(server){


server.get("/api/verify", function(req, res, err){
  tokenGenerator.checkBU( req.headers.token , ['manager', 'user'], function( authroized ){
    if( authroized ){
      res.send('authroized')
    }else{
      res.send('Unauthorized')
    }
  })

})

  /**
   * @name get(/businessusers)
   * @description obtener todos los usuarios de negocio.
   * @memberof businessUsersRoutes
   * @function GET businessUser
   * @param request object
   * @param results object
   * @param error object
   */
server.get("/api/business-users", function( req, res, err ){
    var respuestaJson = {};
    logger.info('Solicitud de obtencion de todos los usuarios de negocio');
    var results = [];
    tokenGenerator.checkBU( req.headers.token, ['admin'], function (isBU){
        if ( isBU == true ){
          databaseObject.getAllBU( res, results );
        }else{
          respuestaJson = respuesta.addError(respuestaJson, 401, 'Unauthorized')
          res.status(401).json(respuestaJson);
        }
    })

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
server.post("/api/business-users", function( req, res, err ){
    var respuestaJson = {};
    logger.info('Solicitud de creacion de un usuario de negocio');
    var token = randtoken.generate(16);
    tokenGenerator.checkBU( req.headers.token, ['admin'], function (isBU){
        if ( isBU == true ){
          databaseObject.createBU(res, req.body.username, req.body.password, req.body.name, req.body.surname, req.body.role, token);
        }else{
          respuestaJson = respuesta.addError(respuestaJson, 401, 'Unauthorized')
          res.status(401).json(respuestaJson);
        }
    })
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
server.post("/api/token", function( req, res, err ){
    logger.info('Solicitud de inicio de sesion');
    databaseObject.checkAuth( res, req );
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
server.get("/api/business-users/me", function( req, res, err ){
  var respuestaJson = {};
    logger.info('Solicitud de informacion personal');
    tokenGenerator.checkBU( req.headers.token, ['user'], function (isBU){
        if ( isBU == true ){
          databaseObject.getPersonalInfo( res, req, req.session.userId );
        }else{
          respuestaJson = respuesta.addError(respuestaJson, 401, 'Unauthorized')
          res.status(401).json(respuestaJson);
        }
    })
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
server.put("/api/business-users/me", function( req, res, err ){
  var respuestaJson = {};
    logger.info('Solicitud de actualizacion de informacion personal');
    tokenGenerator.checkBU( req.headers.token, ['admin', 'user'], function (isBU){
        if ( isBU == true ){
          databaseObject.updateInfo( res, req, req.session.userId );
        }else{
          respuestaJson = respuesta.addError(respuestaJson, 401, 'Unauthorized')
          res.status(401).json(respuestaJson);
        }
    })
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
server.delete("/api/business-users/:userId", function( req, res, err ){
    logger.info('Solicitud de borrado de usuario: ' + req.params.userId);
    var respuestaJson = {};
    tokenGenerator.checkBU( req.headers.token, ['admin'], function (isBU){
        if ( isBU == true ){
          databaseObject.delete( res, req );
        }else{
          respuestaJson = respuesta.addError(respuestaJson, 401, 'Unauthorized')
          res.status(401).json(respuestaJson);
        }
    })
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
server.get("/api/business-users/:userId", function( req, res, err ){
  var respuestaJson = {};
    logger.info('Solicitud de obtencion de usuario Id: ' + req.params.userId);
    tokenGenerator.checkBU( req.headers.token, ['user'], function (isBU){
        if ( isBU == true ){
          databaseObject.getPersonalInfo( res, req, req.params.userId );
        }else{
          respuestaJson = respuesta.addError(respuestaJson, 401, 'Unauthorized')
          res.status(401).json(respuestaJson);
        }
    })

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
server.put("/api/business-users/:userId", function( req, res, err ){
  var respuestaJson = {};
    logger.info('Solicitud de actualizacion de informacion del usuario Id: ' + req.params.userId);
    tokenGenerator.checkBU( req.headers.token, ['admin'], function (isBU){
        if ( isBU == true ){
          databaseObject.updateInfo( res, req, req.params.userId );
        }else{
          respuestaJson = respuesta.addError(respuestaJson, 401, 'Unauthorized')
          res.status(401).json(respuestaJson);
        }
    })

  });

}

module.exports = businessUsersRoutes;
