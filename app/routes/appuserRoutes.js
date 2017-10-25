var usersDB = require('../models/appusersdb')
var respuesta = require('../models/respuesta')
var carsDB = require('../models/carsDb')
var loginCheck = require('../models/loginCheck')
var path = require('path')
var logger = require('../config/herokuLogger.js')


/**
 * @namespace appUsersRoutes
 */

/**
 * @constructor
 * @param {Object} server Servidor express.
 */

 appUsersRoutes = function(server){

   /**
    * @name get(/users)
    * @description obtener todos los usuarios de la aplicacion.
    * @memberof appUsersRoutes
    * @function GET appUsers
    * @param request object
    * @param results object
    * @param error object
    */

  server.get('/users', function(req, res, err){
    logger.info('Informacion de todos los usuarios');

      var results = [];
      loginCheck.check( req.headers.token, ['user', 'admin'], function( authorized){
        if( authorized == true ){
          usersDB.getAllUsers( res, results );
        }else{
          res.status(409).json({'message':'Unauthorized'});
        }
      })
});

/**
 * @name post(/users)
 * @description dar de alta un usuario de aplicacion
 * @memberof appUsersRoutes
 * @function POST appUsers
 * @param request object
 * @param results object
 * @param error object
 */
  server.post('/users', function(req, res, err){
    logger.info('Solicitud para dar de alta un usuario');
    loginCheck.check( req.headers.token, [''], function( authorized){
      if( authorized == true ){
        usersDB.createUser( res, req );
      }else{
        res.status(409).json({'message':'Unauthorized'});
      }
    })
});

/**
 * @name post(/users/validate)
 * @description validar credenciales de un usuario de la aplicacion.
 * @memberof appUsersRoutes
 * @function POST validation
 * @param request object
 * @param results object
 * @param error object
 */
  server.post('/users/validate', function(req, res, err){
    logger.info('Validar las credenciales del usuario');
    //VALIDAR TOKEN CON FACEBOOK?.
      usersDB.validateUser( res, req, req.params.userId );

});

/**
 * @name delete(/users/:userId)
 * @description dar de baja un usuario de la aplicacion.
 * @memberof appUsersRoutes
 * @function DELETE appUsers
 * @param request object
 * @param results object
 * @param error object
 */
  server.delete('/users/:userId', function(req, res, err){
    logger.info('Solicitud para dar de baja un usuario');
    loginCheck.check( req.headers.token, ['manager'], function( authorized){
      if( authorized == true ){
        usersDB.deleteUser( res, req.params.userId);
      }else{
        res.status(401).json({'message':'Unauthorized'});
      }
    })
});


/**
 * @name get(/users/:userId)
 * @description obtener un usuario de la aplicacion.
 * @memberof appUsersRoutes
 * @function GET appUser
 * @param request object
 * @param results object
 * @param error object
 */
  server.get('/users/:userId', function(req, res, err){
    logger.info('Solicitud para obtener informacion de un usuario');
    loginCheck.check( req.headers.token, ['user'], function( authorized){
      if( authorized == true ){
        usersDB.getUser( res, req.params.userId );
      }else{
        res.status(401).json({'message':'Unauthorized'});
      }
    })

});

/**
 * @name put(/users/:userId)
 * @description modificar informacion de un usuario de la aplicacion.
 * @memberof appUsersRoutes
 * @function PUT appUser
 * @param request object
 * @param results object
 * @param error object
 */
  server.put('/users/:userId', function(req, res, err){
    logger.info('Solicitud para modificar informacion de un usuario');
    loginCheck.check( req.headers.token, [''], function( authorized){
      if( authorized == true ){
        usersDB.updateUser(res, req);
      }else{
        res.status(401).json({'message':'Unauthorized'});
      }
    })


});

/**
 * @name get(/users/:userId/cars)
 * @description obtener todos los autos de un usuario de la aplicacion.
 * @memberof appUsersRoutes
 * @function GET cars
 * @param request object
 * @param results object
 * @param error object
 */
  server.get('/users/:userId/cars', function(req, res, err){
    logger.info('Solicitud para obtener los autos asociados a un usuario');
    loginCheck.check( req.headers.token, ['user'], function( authorized){
      if( authorized == true ){
        carsDB.getAll( res, req.params.userId );
      }else{
        res.status(401).json({'message':'Unauthorized'});
      }
    })

});


/**
 * @name post(/users/:userId/cars)
 * @description dar de alta auto de un usuario de la aplicacion.
 * @memberof appUsersRoutes
 * @function POST car
 * @param request object
 * @param results object
 * @param error object
 */
  server.post('/users/:userId/cars', function(req, res, err){
    logger.info('Solicitud para dar de alta un auto de un usuario');
    loginCheck.check( req.headers.token, [''], function( authorized){
      if( authorized == true ){
        carsDB.create(res, req);
      }else{
        res.status(401).json({'message':'Unauthorized'});
      }
    })

  });

  /**
   * @name get(/users/:userId/cars/:carID)
   * @description obtener un  auto de un usuario de la aplicacion.
   * @memberof appUsersRoutes
   * @function GET car
   * @param request object
   * @param results object
   * @param error object
   */
  server.get('/users/:userId/cars/:carId', function(req, res, err){
    logger.info('Solicitud para obtener un auto asociado a un usuario');
    loginCheck.check( req.headers.token, ['user'], function( authorized){
      if( authorized == true ){
        carsDB.get( res, req );
      }else{
        res.status(401).json({'message':'Unauthorized'});
      }
    })
  });

  /**
   * @name delete(/users/:userId/cars/:carId)
   * @description dar de baja auto de un usuario de la aplicacion.
   * @memberof appUsersRoutes
   * @function DELETE car
   * @param request object
   * @param results object
   * @param error object
   */
  server.delete('/users/:userId/cars/:carId', function(req, res, err){
    logger.info('Solicitud para dar de baja un auto asociado a un usuario');
    loginCheck.check( req.headers.token, ['manager'], function( authorized){
      if( authorized == true ){
        carsDB.delete( res, req );
      }else{
        res.status(401).json({'message':'Unauthorized'});
      }
    })
  });


  /**
   * @name put(/users/:userId/cars/:carId)
   * @description modificar informacion de un auto de un usuario de la aplicacion.
   * @memberof appUsersRoutes
   * @function PUT car
   * @param request object
   * @param results object
   * @param error object
   */
  server.put('/users/:userId/cars/:carId', function(req, res, err){
    logger.info('Solicitud para modificar informacion de un auto asociado a un usuario');
    loginCheck.check( req.headers.token, ['user'], function( authorized){
      if( authorized == true ){
        carsDB.update(res, req);
      }else{
        res.status(401).json({'message':'Unauthorized'});
      }
    })
  });

}

module.exports = appUsersRoutes;
