var usersDB = require('../models/appusersdb')
var respuesta = require('../models/respuesta')
var carsDB = require('../models/carsDb')
var loginCheck = require('../models/loginCheck')
var path = require('path')
var logger = require('../config/herokuLogger.js')



 module.exports = function(server){

  server.get('/users', function(req, res, err){
    logger.info('Informacion de todos los usuarios');

    if( loginCheck.check(req, res) == true){
      var results = [];
      usersDB.getAllUsers( res, results );
    }
});

  server.post('/users', function(req, res, err){
    logger.info('Solicitud para dar de alta un usuario');
    usersDB.createUser( res, req );
});

  server.post('/users/validate', function(req, res, err){
    logger.info('Validar las credenciales del usuario');
    //CASI HECHO, FALTA TERMINAR.
});

  server.delete('/users/:userId', function(req, res, err){
    logger.info('Solicitud para dar de baja un usuario');

    if(loginCheck.check(req, res) == true){
      usersDB.deleteUser( res, req, req.params.userId );
    }
});

  server.get('/users/:userId', function(req, res, err){
    logger.info('Solicitud para obtener informacion de un usuario');

    if(loginCheck.check(req, res) == true){
      usersDB.getUser( res, req.params.userId );
    }
});

  server.put('/users/:userId', function(req, res, err){
    logger.info('Solicitud para modificar informacion de un usuario');

    if(loginCheck.check( req, res ) == true){
      usersDB.updateUser(res, req);
    }

});

  server.get('/users/:userId/cars', function(req, res, err){
    logger.info('Solicitud para obtener los autos asociados a un usuario');

    if(loginCheck.check(req, res) == true){
      carsDB.getAllCarsFromId( res, req.params.userId );
    }
});

  server.post('/users/:userId/cars', function(req, res, err){
    logger.info('Solicitud para dar de alta un auto de un usuario');

    if(loginCheck.check(req, res) ==  true){
      carsDB.createCar(res, req);
    }

  });

  server.get('/users/:userId/cars/:carId', function(req, res, err){
    logger.info('Solicitud para obtener un auto asociado a un usuario');

    if(loginCheck.check(req, res) == true){
      carsDB.getCar( res, req );
    }

  });

  server.delete('/users/:userId/cars/:carId', function(req, res, err){
    logger.info('Solicitud para dar de baja un auto asociado a un usuario');

    if(loginCheck.check( req, res ) == true){
      carsDB.deleteCar( res, req );
    }

  });

  server.put('/users/:userId/cars/:carId', function(req, res, err){
    logger.info('Solicitud para modificar informacion de un auto asociado a un usuario');

  });

  server.get("/front/users", function(req, res, err){
    res.sendfile(path.resolve('./app/components/appusers/usersList.html'));
  })
}
