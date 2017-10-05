const { Client } = require('pg')
const db = require('../config/pgdb')
var respuesta = require('./respuesta')
var logger = require('../config/herokuLogger')


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
}


module.exports = carsDB;
