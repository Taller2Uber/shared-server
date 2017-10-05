const { Client } = require('pg')
const db = require('../config/pgdb')
var logger = require('../config/herokuLogger')
var refCheck = require('./refCheck')
var async = require('asyncawait/async')
var await = require('asyncawait/await')
var respuesta = require('./respuesta')



function buDB(){}


buDB.prototype.createBU = function ( res, username, password, name, surname, role ){
  var respuestaJson = {};
  client = new Client({connectionString: db.url, ssl:true});
  if( db.connectClient( client, res ) ){
    if( !username || !password || !name || !surname || !role ){
      logger.error('Incumplimiento de precondiciones (parámetros faltantes)');
      respuestaJson = respuesta.addError(respuestaJson, 400, 'Incumplimiento de precondiciones');
      res.status(400).json(respuestaJson);
    }else{
      var jsonBU = {"username":username, "password":password, "name":name, "surname":surname, "role":role };
      var ref =  refCheck.generate( jsonBU );
      client.query('INSERT INTO businessusers (username, password, name, surname, _ref, role) VALUES ($1, $2, $3, $4, $5, $6)', [username, password, name, surname, ref, role],(err, res) => {
        console.log(err, res)
      })
      respuestaJson = respuesta.addDescription(respuestaJson, 'Alta correcta');
      res.status(201).json(respuestaJson);
    }
  }else{
    respuestaJson = respuesta.addError(respuestaJson, 500, 'Unexpected error');
    res.status(500).json(respuestaJson);
  }
}

buDB.prototype.getAllBU = function( response, results ){

  client = new Client({connectionString: db.url, ssl:true});
  var respuestaJson = {};
  if ( db.connectClient( client, response ) ){
    var query = client.query('SELECT * FROM businessusers', (err, res) =>{
      res.rows.forEach(row =>{
        results.push(row);
      });
      client.end();
      respuestaJson = respuesta.addResult(respuestaJson, results);
      response.status(200).json(respuestaJson);
      return(results);
    })
  }else{
    respuestaJson = respuesta.addError(respuestaJson, 500, 'Unexpected error');
    response.status(500).json(respuestaJson);
  }
}

buDB.prototype.checkAuth = function( response, request , session){
  if ( !request.body.username || !request.body.password ){
    logger.info('Informacion faltante');
    response.status(500).send('Informacion faltante');
    session = request.session;
    session.authenticated = false;
    return;
  }

  client = new Client({connectionString: db.url, ssl:true});
    if( db.connectClient( client, response ) ){
      logger.info('Se conecto a la base de datos correctamente.')
      var results = [];
      client.query('SELECT * FROM businessusers WHERE username = $1 AND password = $2',[request.body.username, request.body.password], (err, res) =>{
        if(err)
          response.send('Error en la query');
        else{
            res.rows.forEach(row =>{
            results.push(row);
            });
          checkLogin(results, response, request, session);
        }
      });
    }
}

function checkLogin(results, response, request, session){
  if( results.length <= 0 ){
    logger.info('Usuario y password incorrectos');
    var respuestaJson = {};
    respuestaJson = respuesta.addError(respuestaJson, 500, 'Username y password incorrectos');
    response.status(500).json(respuestaJson);
    client.end();
  } else {
    logger.info('Inicio de sesion correcta');
    session = request.session;
    session.authenticated = true;
    session.role = results[0]['role'];
    logger.info('Role: ' + session.role );
    session.userId = results[0]['id'];
    response.status(200).send('Inicio de sesion correcta')
    client.end();
  }
}

buDB.prototype.getPersonalInfo = function( response, request, userId ){
  client = new Client({connectionString: db.url, ssl:true});
  var respuestaJson = {};
  if( db.connectClient( client, response ) ){
      logger.info("Se conecto a la base de datos correctamente");
      var results = [];
      client.query('SELECT * FROM businessusers WHERE id = $1', [userId], (err, res) =>{
        if( err )
          response.send('Error en la query');
        else {
            res.rows.forEach(row =>{
            results.push(row);
            });
            if( results.length <= 0 ){
              logger.info('User inexistente');
              respuestaJson = respuesta.addError(respuestaJson, 404, 'User inexistente');
              response.status(404).json(respuestaJson);
            } else {
              logger.info('Informacion del usuario');
              respuestaJson = respuesta.addDescription(respuestaJson, 'Informacion del usuario');
              respuestaJson = respuesta.addResult(respuestaJson, results[0]);
              response.status(200).json(respuestaJson);
            }
          }
      });
    }else{
      respuestaJson = respuesta.addError(respuestaJson, 500, 'Unexpected error');
      response.status(500).json(respuestaJson);
    }
}

buDB.prototype.updateInfo = function( response, request, userId ){
  var respuestaJson = {};
  client = new Client({connectionString: db.url, ssl:true});
    if( db.connectClient( client, response ) ){
      client.query('SELECT _ref FROM businessusers WHERE id = $1',[userId], (err, res) =>{
        if(err){
          logger.info('ERROR: ' + err);
          return false;
        }
        else{
          res.rows.forEach(row =>{
            ref = JSON.parse(JSON.stringify(row, null, 2));
          if( ref._ref === request.body._ref ){
            var jsonBU = {"username":request.body.username, "password":request.body.password, "name":request.body.name, "surname":request.body.surname, "role":request.body.role };
            var newRef = refCheck.generate(jsonBU);
            client.query('UPDATE businessusers SET name = $1, username = $2, password = $3, surname = $4, role = $5, _ref = $6 WHERE id = $7',
                [ request.body.name, request.body.username, request.body.password, request.body.surname, request.body.role ,newRef, userId ], (err, res) =>{
              if( err ){
                logger.info('No existe el recurso solicitado');
                respuestaJson = respuesta.addError(respuestaJson, 404, 'No existe el recurso solicitado');
                response.status(404).json(respuestaJson);
              } else {
                logger.info('Actualización de información del usuario de negocio conectado');
                respuestaJson = respuesta.addDescription(respuestaJson, 'Modificacion correcta');
                jsonBU._ref = newRef;
                respuestaJson = respuesta.addResult(respuestaJson, jsonBU);
                response.status(200).json(respuestaJson);
              }
          })
        }else{
          logger.info('Ref incorrecto');
          respuestaJson = respuesta.addError(respuestaJson, 409, 'Conflicto en el update. Mal valor de ref');
          response.status(409).json(respuestaJson);
        }});
      }
    });
    }else{
      logger.info('Unexpected error');
      respuestaJson = respuesta.addError(respuestaJson, 500, 'Unexpected error');
      response.status(500).send(respuestaJson);
}}

buDB.prototype.delete = function( response, request ){
  var respuestaJson = {};
  client = new Client({connectionString: db.url, ssl:true});
  if( db.connectClient( client, response ) ){
    var query = client.query('DELETE FROM businessusers WHERE id =  $1',[request.params.userId], ( err, res) =>{
          if(err){
            logger.info('No existe el recurso solicitado');
            respuestaJson = respuesta.addError(respuestaJson, 404, 'No existe el recurso solicitado');
            response.status(404).json(respuestaJson);
          }else{
            logger.info('Baja correcta');
            respuestaJson = respuesta.addDescription(respuestaJson, 'Baja correcta');
            response.status(200).json(respuestaJson);
          }
    });
  }

}


module.exports = buDB;
