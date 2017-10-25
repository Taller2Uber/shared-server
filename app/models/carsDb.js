const pg = require('pg')
var Pool = require('pg-pool')
const db = require('../config/pgdb')
var respuesta = require('./respuesta')
var logger = require('../config/herokuLogger')
var refHash = require('./refCheck')


// auto nuevo {properties: [ {name, value}, {name, value}, {name, value}]}

function carsDB(){}

carsDB.getAll = function( response, userId ){
  var respuestaJson = {};
  var results = [];
  const pool = new Pool(db.configDB);
  pool.connect().then(client =>{
    client.query('SELECT cars FROM users WHERE  id = $1', [userId], (err, res) =>{
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
  }).catch(e =>{
    logger.error('Unexpected error: ' + e);
    respuestaJson = respuesta.addError(respuestaJson, 500, 'Unexpected error');
    response.status(500).json(respuestaJson);
  })
}


carsDB.create = function( response, request ){
  var respuestaJson = {};

  var propiedades = request.body.properties;

  const pool = new Pool(db.configDB);
  var cars = [];
  var properties = [];
  pool.connect().then(client =>{
    client.query('SELECT cars FROM users WHERE id = $1', [request.params.userId], (err, results) =>{
      if(err){
        respuestaJson = respuesta.addError(respuestaJson, 500, 'Unexpected error');
        response.status(400).json(respuestaJson);
        return;
      }else{
        if( results.rows[0].cars != null ){
          cars = results.rows[0].cars;
        }
        var car = {};
        car.properties = request.body.properties;
        car.id = results.rows[0].cars.length + 1;
        car.owner = request.params.userId;
        car._ref = refHash.generate( car );
        cars.push(car);
        var carsToSave = JSON.stringify(cars);
        client.query('UPDATE users SET cars = $1 WHERE id = $2', [carsToSave, request.params.userId], (err, res)=>{
          if(err){
            logger.error('Unexpected error: ' + err);
          }else{
            logger.info('Alta correcta');
            response.send('Alta correcta');
          }
        })
        }
      })
  }).catch(e =>{
    respuestaJson = respuesta.addError(respuestaJson, 500, 'Unexpected error');
    response.status(500).json(respuestaJson);
  })
}

carsDB.get = function( response, request ){
  var respuestaJson = {};
  var autos = [];
  const pool = new Pool(db.configDB);
  pool.connect().then(client =>{
    client.query('SELECT cars FROM users WHERE id = $1',[request.params.userId],(err, results)=>{
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
  }).catch(e =>{
    logger.error('Unexpected error: ' + e);
    respuestaJson = respuesta.addError(respuestaJson, 500, 'Unexpected error');
    response.status(500).json(respuestaJson);
  })
}

carsDB.delete = function( response, request ){
  var respuestaJson = {}
  const pool = new Pool(db.configDB);
  pool.connect().then(client =>{
    client.query('SELECT cars FROM users WHERE id = $1', [request.params.userId], (err, res) =>{
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
            client.query('UPDATE users SET cars = $1 WHERE id = $2',[ carsToSave, request.params.userId ], (err, res) =>{
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
  }).catch(e =>{
    logger.error('Unexpected error: ' + e);
    respuestaJson = respuesta.addError(respuestaJson, 500, 'Unexpected error');
    response.status(500).json(respuestaJson);
  })
}


carsDB.update = function( response, request ){
  var respuestaJson = {};
  if( !request.body.car._ref ){
    response.status(400).json(respuesta.addError(respuestaJson, 400, 'Incumplimiento de precondiciones (parametros faltantes)'));
  }else{
    const pool = new Pool(db.configDB);
    pool.connect().then(client =>{
      client.query('SELECT cars FROM users WHERE id = $1', [request.params.userId], (err, res) =>{
        if(err){
          logger.error('Unexpected error: ' + e);
          response.status(500).json(respuesta.addError(respuestaJson, 500, 'Unexpected error'));
        }else{
          var contador = -1;
          var index = -1;
          var autos = res.rows[0].cars;
          console.log(autos);
          var refCorrecto = false;
          for( var auto of autos ){
            contador = contador + 1;
            if ( auto.id == request.params.carId ){
              index = contador;
              if( auto._ref == request.body.car._ref ){
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
            autos.push(request.body.car);
            var carsToSave = JSON.stringify(autos);
            client.query('UPDATE users SET cars = $1 WHERE id = $2',[ carsToSave, request.params.userId ], (err, res) =>{
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
    }).catch(e =>{
      logger.error('Unexpected error: ' + e);
      response.status(500).json(respuesta.addError(respuestaJson, 500, 'Unexpected error'));
    })
  }
}

module.exports = carsDB;
