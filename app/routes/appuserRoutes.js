var usersDB = require('../models/appusersdb')
var respuesta = require('../models/respuesta')
var carsDB = require('../models/carsDb')
var loginCheck = require('../models/loginCheck')
var path = require('path')
var tripsDB = require('../models/tripsDB')
var logger = require('../config/herokuLogger.js')
var transactionDB = require('../models/transactionDB')

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

  server.get('/api/users', function(req, res, err){
    logger.info('Informacion de todos los usuarios');

      var results = [];
      //loginCheck.check( req.headers.token, ['user', 'admin'], function( authorized){
        //if( authorized == true ){
          //logger.info(JSON.stringify(req.headers));
          usersDB.getAllUsers( res, results );
        //}else{
          //logger.error('Unauthorized');
          //logger.error(JSON.stringify(req.headers));
          //res.status(409).json({'message':'Unauthorized'});
        //}
      //})
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
  server.post('/api/users', function(req, res, err){
    logger.info('Solicitud para dar de alta un usuario');
    loginCheck.check( req.headers.token, [''], function( authorized, serverJson){
      if( authorized == true ){
        logger.info(serverJson.id)
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
  server.post('/api/users/validate', function(req, res, err){
    logger.info('Validar las credenciales del usuario');
    //VALIDAR TOKEN CON FACEBOOK?.
      usersDB.validateUser( res, req );
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
  server.delete('/api/users/:userId', function(req, res, err){
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
  server.get('/api/users/:userId', function(req, res, err){
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
  server.put('/api/users/:userId', function(req, res, err){
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
  server.get('/api/users/:userId/cars', function(req, res, err){
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
  server.post('/api/users/:userId/cars', function(req, res, err){
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
  server.get('/api/users/:userId/cars/:carId', function(req, res, err){
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
  server.delete('/api/users/:userId/cars/:carId', function(req, res, err){
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
  server.put('/api/users/:userId/cars/:carId', function(req, res, err){
    logger.info('Solicitud para modificar informacion de un auto asociado a un usuario');
    loginCheck.check( req.headers.token, ['user'], function( authorized){
      if( authorized == true ){
        carsDB.update(res, req);
      }else{
        res.status(401).json({'message':'Unauthorized'});
      }
    })
  });

  server.get('/api/users/:userId/trips', function(req, res, err){
    logger.info('Solicitud para obtener los viajes de un usuario');
    loginCheck.check( req.headers.token, ['user'], function( authorized){
      if( authorized == true ){
        tripsDB.getTripsFromUser(req, res);
      }else{
        res.status(401).json({'message':'Unauthorized'});
      }
    })
  });

  server.post('/api/users/:userId/addcost', function(req, res, err){
    transactionDB.addCost(req.params.userId, req.body.currency, req.body.value, res);
  })

  server.post('/api/users/:userId/transactions', function(req, res, err){
    transactionDB.create(req, res);
  })

  server.get('/api/users/:userId/transactions', function(req, res, err){
    transactionDB.getAll(req, res);
  })


}

module.exports = appUsersRoutes;
