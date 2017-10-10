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

    if( loginCheck.check(req, res) == true){
      var results = [];
      usersDB.getAllUsers( res, results );
    }
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
    usersDB.createUser( res, req );
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
    //CASI HECHO, FALTA TERMINAR.
    if(loginCheck.check(req, res) == true){
      usersDB.validateUser( res, req, req.params.userId );
    }
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

    if(loginCheck.check(req, res) == true){
      usersDB.deleteUser( res, req);
    }
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

    if(loginCheck.check(req, res) == true){
      usersDB.getUser( res, req.params.userId );
    }
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

    if(loginCheck.check( req, res ) == true){
      usersDB.updateUser(res, req);
    }

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

    if(loginCheck.check(req, res) == true){
      carsDB.getAllCarsFromId( res, req.params.userId );
    }
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

    carsDB.createCar(res, req);

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

    if(loginCheck.check(req, res) == true){
      carsDB.getCar( res, req );
    }

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

    if(loginCheck.check( req, res ) == true){
      carsDB.deleteCar( res, req );
    }

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

  });

}

module.exports = appUsersRoutes;
