const  { Client }  = require('pg')
const db = require('../config/pgdb')
var respuesta = require('./respuesta')
var logger = require('../config/herokuLogger')


// auto nuevo {ownerId: 'unId', properties: [ {name, value}, {name, value}, {name, value}]}

function carsDB(){}

carsDB.getAllCarsFromId = function( response, userId ){
  var respuestaJson = {};
  var results = [];
  client = new Client({connectionString: db.url, ssl:true});
  if( db.connectClient( client, response ) ){
    client.query('SELECT * FROM cars WHERE  owner = $1', [userId], (err, res) =>{
      if(err || res.length <=0 ){
        respuestaJson = respuesta.addError(respuestaJson, 404, 'El recurso solicitado no existe');
        response.status(404).json(respuestaJson);
      }else{
        res.rows.forEach(row =>{
          results.push(row);
        })
      }
      respuestaJson = respuesta.addDescription(respuestaJson, 'Informacion de autos de un usuario');
      respuestaJson = respuesta.addResult(respuestaJson, results);
      response.status(200).json(respuestaJson);
    });
  }else{
    respuestaJson = respuesta.addError(respuestaJson, 500, 'Unexpected error');
    response.status(500).json(respuestaJson);
  }
  client.end();
}

carsDB.createCar = function( response, request ){
  var respuestaJson = {};

  if( request.params.userId == null ){
    respuestaJson = respuesta.addError(respuestaJson, 400, 'Incumplimiento de precondiciones');
    response.status(400).json(respuestaJson);
    return;
  }
  var propiedades = request.body.properties;
  client = new Client({connectionString: db.url, ssl:true});
  if( db.connectClient( client, response ) ){
    client.query('INSERT INTO cars (owner) VALUES ($1) RETURNING *', [request.params.userId], (err, results) =>{
      if(err){
        logger.error("Error al insertar el auto: " + err);
        respuestaJson = respuesta.addError(respuestaJson, 500, 'Unexpected error');
        response.status(400).json(respuestaJson);
      }else{

        for(var propiedad of propiedades){
          logger.info('name: '+ propiedad.name);
          logger.info('value: ' + propiedad.value);

          client.query('INSERT INTO carProperties (name, value, carid) VALUES ($1, $2, $3)', [propiedad.name, propiedad.value, results.rows[0].id], (err, res) =>{
            if(err){
              logger.info(err);
              respuestaJson = respuesta.addError(respuestaJson, 500, 'Error al ingresar una propiedad');
              response.status(500).json(respuestaJson);
              client.end()
              return;
            }else{
              logger.info('Alta correcta: ' + results.rows[0].id );
              respuestaJson = respuesta.addDescription(respuestaJson, 'Alta correcta');
              response.status(201).json(respuestaJson);
            }
          })
        }
      }
    })

  }else{
    respuestaJson = respuesta.addError(respuestaJson, 500, 'Unexpected error');
    response.status(500).json(respuestaJson);
  }
  client.end();
}

carsDB.getCar = function( response, request ){
  var respuestaJson = {};

  client = new Client({connectionString: db.url, ssl:true});
  if( db.connectClient( client, response ) ){
    client.query('SELECT * FROM cars WHERE id = ($1) and owner = ($2)',[request.params.carId, request.params.userId],(err, results)=>{
      if(err){
        respuestaJson = respuesta.addError(respuestaJson, 500, 'Unexpected error');
        response.status(500).json(respuestaJson);
      }else{
        if( results.rows.length == 0 ){
          respuestaJson = respuesta.addDescription(respuestaJson, 'Auto inexistente');
          response.status(404).json(respuestaJson);
        }else{
          respuestaJson = respuesta.addResult(results.rows[0]);
          response.status(200).json(respuestaJson);
        }
      }
    })

  }else{
    respuestaJson = respuesta.addError(respuestaJson, 500, 'Unexpected error');
    response.status(500).json(respuestaJson);
  }
  client.end();
}

carsDB.deleteCar = function( response, request ){

  var respuestaJson = {}

  client = new Client({connectionString: db.url, ssl:true});
  if( db.connectClient( client, response ) ){
    client.query('DELETE FROM cars WHERE id = ($1) and owner = ($2)', [request.params.carId, request.params.userId], (err, res) =>{
      if(err){
        respuestaJson = respuesta.addError(respuestaJson, 404, 'No existe el recurso solicitado');
        response.status(404).json(respuestaJson);
      }else{
        respuestaJson = respuesta.addDescription(respuestaJson, 'Baja correcta');
        response.status(204).json(respuestaJson);
      }
    })
  }else{
    respuestaJson = respuesta.addError(respuestaJson, 500, 'Unexpected error');
    response.status(500).json(respuestaJson);
  }
  client.end();
}


module.exports = carsDB;
