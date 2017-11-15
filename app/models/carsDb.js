const connect = require('../config/pgdb')
var respuesta = require('./respuesta')
var logger = require('../config/herokuLogger')
var refHash = require('./refCheck')



/**
 * @class Clase para definir las llamadas a la base de datos de autos
 */

function carsDB(){}

/**
* @name getAll
* @function getAllCars
* @memberof carsDB
* @author Gustavo Adrian Gimenez
* @param response Objeto por el cual se realiza la devolucion a la llamada
* @param userId id del usuario del cual queremos obtener los autos
*/

carsDB.getAll = function( response, userId ){
  var respuestaJson = {};
  var results = [];
    connect().query('SELECT cars FROM users WHERE  id = $1', [userId], (err, res) =>{
      if(err){
        logger.error('Unexpected error: ' + err);
        response.status(500).json(respuesta.addError(respuestaJson, 500, 'Unexpected error'));
      }else if( res.rows.length <= 0 ){
        respuestaJson = respuesta.addError(respuestaJson, 404, 'El recurso solicitado no existe');
        response.status(404).json(respuestaJson);
      }else{
        results = res.rows[0].cars;
        }
        respuestaJson = respuesta.addDescription(respuestaJson, 'Informacion de autos de un usuario');
        respuestaJson = respuesta.addResult(respuestaJson, 'cars', results);
        response.status(200).json(respuestaJson);
      });
}



/**
* @name create
* @function createCar
* @memberof carsDB
* @author Gustavo Adrian Gimenez
* @param response Objeto por el cual se realiza la devolucion a la llamada
* @param request Objeto que contiene informacion de la llamada realizada por el cliente a la api
*/

carsDB.create = function( response, request ){
  var respuestaJson = {};

  var propiedades = request.body.properties;
  var cars = [];
  var properties = [];
    connect().query('SELECT cars FROM users WHERE id = $1', [request.params.userId], (err, results) =>{
      if(err){
        respuestaJson = respuesta.addError(respuestaJson, 500, 'Unexpected error');
        response.status(400).json(respuestaJson);
        return;
      }else{
        if( results.rows[0].cars != null ){
          cars = results.rows[0].cars
        }else{
          results.rows[0].cars = []
        }
        var car = {};
        car.properties = request.body.properties;
        car.id = results.rows[0].cars.length + 1;

        car.owner = request.params.userId;
        car._ref = refHash.generate( car );
        cars.push(car);
        var carsToSave = JSON.stringify(cars);
        connect().query('UPDATE users SET cars = $1 WHERE id = $2', [carsToSave, request.params.userId], (err, res)=>{
          if(err){
            logger.error('Unexpected error: ' + err);
            response.status(500).json(respuesta.addError(respuestaJson, 500, 'Unexpected error'));
          }else{
            logger.info('Alta correcta');
            respuestaJson = respuesta.addEntityMetadata(respuestaJson);
            respuestaJson = respuesta.addResult(respuestaJson, 'car', car);
            response.status(201).json(respuestaJson);
          }
        })
        }
      })
}


/**
* @name get
* @function getCar
* @memberof carsDB
* @author Gustavo Adrian Gimenez
* @param response Objeto por el cual se realiza la devolucion a la llamada
* @param request Objeto que contiene informacion de la llamada realizada por el cliente a la api
*/

carsDB.get = function( response, request ){
  var respuestaJson = {};
  var autos = [];
    connect().query('SELECT cars FROM users WHERE id = $1',[request.params.userId],(err, results)=>{
      if(err){
        respuestaJson = respuesta.addError(respuestaJson, 500, 'Unexpected error');
        response.status(500).json(respuestaJson);
      }else{
        if( results.rows.length == 0 ){
          respuestaJson = respuesta.addDescription(respuestaJson, 'Auto inexistente');
          response.status(404).json(respuestaJson);
        }else{
          autos = results.rows[0].cars;
          var encontroAuto = false;
          for(var auto of autos){
            if( auto.id == request.params.carId ){
              respuestaJson = respuesta.addResult(respuestaJson, 'car', auto);
              encontroAuto = true;
            }
          }
          if( encontroAuto == false ){
            response.status(404).json(respuesta.addDescription(respuestaJson, 'Auto inexistente'));
          }else{
            response.status(200).json(respuestaJson)
          }
        }
      }
    })
}

/**
* @name delete
* @function deleteCar
* @memberof carsDB
* @author Gustavo Adrian Gimenez
* @param response Objeto por el cual se realiza la devolucion a la llamada
* @param request Objeto que contiene informacion de la llamada realizada por el cliente a la api
*/

carsDB.delete = function( response, request ){
  var respuestaJson = {};
    connect().query('SELECT cars FROM users WHERE id = $1', [request.params.userId], (err, res) =>{
      if(err){
        logger.error(err);
        respuestaJson = respuesta.addError(respuestaJson, 500, 'Unexpected error');
        response.status(404).json(respuestaJson);
      }else{
        if( res.rows.length <= 0 ){
          response.status(404).json(respuesta.addError(respuestaJson, 404, 'No existe el recurso solicitado'));
        }else{
          var contador = -1;
          var index = -1;
          var autos = res.rows[0].cars;
          for( var auto of autos ){
            contador = contador + 1;
            if ( auto.id == request.params.carId ){
              index = contador;
            }
          }
          if( index == -1 ){
            response.status(404).json(respuesta.addError(respuestaJson, 404, 'No existe el recurso solicitado'));
          }else{
            autos.splice(index, 1);
            var carsToSave = JSON.stringify(autos);
            connect().query('UPDATE users SET cars = $1 WHERE id = $2',[ carsToSave, request.params.userId ], (err, res) =>{
              if(err){
                logger.error(err);
                response.status(500).json(respuesta.addError(respuestaJson, 500, 'Unexpected error'));
              }else{
                logger.info('Baja correcta');
                respuestaJson = respuesta.addDescription(respuestaJson, 'Baja correcta');
                response.status(204).json(respuestaJson);
              }
            })
          }
        }
      }
    })
}

/**
* @name update
* @function updateCar
* @memberof carsDB
* @author Gustavo Adrian Gimenez
* @param response Objeto por el cual se realiza la devolucion a la llamada
* @param request Objeto que contiene informacion de la llamada realizada por el cliente a la api
*/

carsDB.update = function( response, request ){
  var respuestaJson = {};
  if( !request.body._ref ){
    response.status(400).json(respuesta.addError(respuestaJson, 400, 'Incumplimiento de precondiciones (parametros faltantes)'));
  }else{
      connect().query('SELECT cars FROM users WHERE id = $1', [request.params.userId], (err, res) =>{
        if(err){
          logger.error('Unexpected error: ' + e);
          response.status(500).json(respuesta.addError(respuestaJson, 500, 'Unexpected error'));
        }else{
          var contador = -1;
          var index = -1;
          var autos = res.rows[0].cars;
          var refCorrecto = false;
          for( var auto of autos ){
            contador = contador + 1;
            if ( auto.id == request.params.carId ){
              index = contador;
              if( auto._ref == request.body._ref ){
                refCorrecto = true;
              }
            }
          }
          if( index == -1 ){
            response.status(404).json(respuesta.addError(respuestaJson, 404, 'No existe el recurso solicitado'));
          }else if(refCorrecto == false){
              response.status(409).json(respuesta.addError(respuestaJson, 409, 'Conflicto con el update (ref incorrecto)'));
          }else{
            autos.splice(index, 1);
            autos.push(request.body);
            var carsToSave = JSON.stringify(autos);
            connect().query('UPDATE users SET cars = $1 WHERE id = $2',[ carsToSave, request.params.userId ], (err, res) =>{
              if(err){
                logger.error(err);
                response.status(500).json(respuesta.addError(respuestaJson, 500, 'Unexpected error'));
              }else{
                logger.info('Modificacion correcta');
                respuestaJson = respuesta.addDescription(respuestaJson, 'Modificacion correcta');
                response.status(204).json(respuestaJson);
              }
            })
          }
        }
      })
  }
}

module.exports = carsDB;
