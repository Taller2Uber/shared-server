var usersDB = require('../models/appusersdb')
var respuesta = require('../models/respuesta')
var carsDB = require('../models/carsDb')

module.exports = function(server){
  var logger = require('../config/herokuLogger.js')

  server.get('/users', function(req, res, err){
    logger.info('Informacion de todos los usuarios');
    var respuestaJson = {};
    if( !req.session.authenticated ){
      respuestaJson = respuesta.addError(respuestaJson, 401, 'Unauthorized');
      res.status(401).json(respuestaJson);
    }else{
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
    if( !req.session.authenticated ){
      var respuestaJson = {};
      respuestaJson = respuesta.addError(respuestaJson, 401, 'Unauthorized');
      res.status(401).json(respuestaJson);
    }else{
      usersDB.deleteUser( res, req, req.params.userId );
    }

});

  server.get('/users/:userId', function(req, res, err){
    logger.info('Solicitud para obtener informacion de un usuario');
    if( !req.session.authenticated ){
      var respuestaJson = {};
      respuestaJson = respuesta.addError(respuestaJson, 401, 'Unauthorized');
      res.status(401).json(respuestaJson);
    }else{
      usersDB.getUser( res, req.params.userId );
    }
});

  server.put('/users/:userId', function(req, res, err){
    logger.info('Solicitud para modificar informacion de un usuario');

});

  server.get('/users/:userId/cars', function(req, res, err){
    logger.info('Solicitud para obtener los autos asociados a un usuario');

    if( !req.session.authenticated ){
      var respuestaJson = {};
      respuestaJson = respuesta.addError(respuestaJson, 401, 'Unauthorized');
      res.status(401).json(respuestaJson);
    }else{
      carsDB.getAllCarsFromId( res, req.params.userId );
    }

});

  server.post('/users/:userId/cars', function(req, res, err){
    logger.info('Solicitud para dar de alta un auto de un usuario');

  });

  server.get('/users/:userId/cars/:carId', function(req, res, err){
    logger.info('Solicitud para obtener un auto asociado a un usuario');

  });

  server.delete('/users/:userId/cars/:carId', function(req, res, err){
    logger.info('Solicitud para dar de baja un auto asociado a un usuario');

  });

  server.put('/users/:userId/cars/:carId', function(req, res, err){
    logger.info('Solicitud para modificar informacion de un auto asociado a un usuario');

  });
}
