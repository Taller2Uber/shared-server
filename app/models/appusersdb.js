const pg  = require('pg')
const db = require('../config/pgdb')
var refCheck = require('./refCheck')
var respuesta = require('./respuesta')
var async = require('asyncawait/async')
var await = require('asyncawait/await')
var logger = require('../config/herokuLogger')
var Pool = require('pg-pool')
var request = require('request')
var refHash = require('./refCheck')


//username, password, type, firstname, lastname, country, email, birthdate, fbtoken, fbuserid

/**
 * @class Clase para definir las llamadas a la base de datos de usuarios de la aplicacion.
 */
function appusers(){}


/** @name getAllUsers
* @function getAllUsers
* @memberof appusers
* @author Gustavo Adrian Gimenez
* @param results array para guardar los usuarios obtenidos
*/
appusers.getAllUsers = async ( function( response, results ){
  var respuestaJson = {};
  const pool = new Pool(db.configDB);
  pool.connect().then(client =>{
    client.query('SELECT * FROM users', (err, res) =>{
      res.rows.forEach(userRow =>{
        var cars = [];
        getCarsFromId(userRow.id, client, function(cars){
          userRow.cars = cars;
        })
        results.push(userRow);
      });
      logger.info('Obteniendo listado de usuarios');
      respuestaJson = respuesta.addCollectionMetadata(respuestaJson, results);
      response.status(200).json(respuesta.addResult(respuestaJson,'users', results));
    })
  }).catch(e =>{
    logger.error('Unexpected error');
    response.status(500).json(respuesta.addError(respuestaJson, 500, 'Unexpected error'));
  })
})

getCarsFromId =  function( id, client, callback ){
  var results = []
  client.query('SELECT * FROM cars WHERE owner = $1', [id], function(err, res){
    res.rows.forEach(row =>{
      results.push(row);
    }
  )})
  callback(results);
}


/** @name createUser
* @function createUser
* @memberof appusers
* @author Gustavo Adrian Gimenez
* @param request debe contener todos los datos necesarios para dar de alta un usuario.
*/
appusers.createUser = function( response, req ){
  var respuestaJson = {};
  if( !req.body.username || !req.body.password || !req.body.firstname || !req.body.type || !req.body.lastname || !req.body.country || !req.body.email || !req.body.birthdate ){
    logger.error('Incumplimiento de precondiciones (parámetros faltantes)');
    response.status(400).json(respuesta.addError(respuestaJson, 400, 'Incumplimiento de precondiciones'));
  }else{
    const pool = new Pool(db.configDB);
    pool.connect().then(client =>{
      var jsonUser = {"username": req.body.username, "password": req.body.password, "firstname": req.body.firstname, "lastname": req.body.lastname,
                      "type": req.body.type, "email": req.body.email, "birthdate": req.body.birthdate, "country": req.body.country, "fbuserid": req.body.fb.userid, "fbtoken": null};

      if( req.body.fb.hasOwnProperty('fbuserid') && req.body.fb.hasOwnProperty('fbtoken')){
        jsonUser.fbuserid = req.body.fb.fbuserid;
        jsonUser.fbtoken = req.body.fb.fbtoken;
      }
      var ref =  refCheck.generate( jsonUser );
      client.query('INSERT INTO users (username, password, firstname, lastname, type, email, birthdate, country, _ref, fbuserid, fbtoken) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11) RETURNING * ;',
                    [req.body.username, req.body.password, req.body.firstname, req.body.lastname, req.body.type, req.body.email, req.body.birthdate, req.body.country, ref, jsonUser.fbuserid, jsonUser.fbtoken], (err, res) => {
      if(err){
        logger.error('Unexpected error: ' + err);
        response.status(500).json(respuesta.addError(respuestaJson, 500, 'Unexpected error'));
      }else{
        respuestaJson = respuesta.addDescription(respuestaJson, 'Alta correcta');
        respuestaJson = respuesta.addResult(respuestaJson, 'user', res.rows[0]);
        jsonUser._ref = ref;
        response.status(201).json(respuesta.addEntityMetadata(respuestaJson));
      }})
    }).catch(e =>{
      logger.error('Unexpected error: ' + e.message);
      response.status(500).json(respuesta.addError(respuestaJson, 500, 'Unexpected error'));
    })
  }
}

/** @name validateUser
* @function validateUser
* @memberof appusers
* @author Gustavo Adrian Gimenez
* @param request debe contener password o facebookAuthToken
*/
appusers.validateUser = function( response, req ){
  var respuestaJson = {};
  if(  !req.body.username && !req.body.password  && !req.body.facebookAuthToken  ){
    response.status(400).json(respuesta.addError(respuestaJson,400, 'Incumplimiento de precondiciones (parámetros faltantes)'));
  }else{
    const pool = new Pool(db.configDB);
    pool.connect().then(client => {
      if(!req.body.facebookAuthToken){
        client.query('SELECT * FROM users WHERE username = $1 AND password = $2', [req.body.username, req.body.password], (err, res) =>{
          if( res.rows.length <= 0 ){
            respuestaJson = respuesta.addError(respuestaJson, 401, 'Usuario invalido');
            response.status(401).json(respuestaJson);
          }else{
            respuestaJson = respuesta.addResult(respuestaJson, 'user', res.rows[0]);
            response.status(200).json(respuestaJson);
          }
        })
      }else{
        request({
          url: "https://graph.facebook.com/me?access_token=" + req.body.facebookAuthToken,
          method: "GET"
        }, function callback(err, res, body){
          if(err){
            response.status(401).json(respuesta.addError(respuestaJson, 401, 'Unauthorized'));
          }else{
            var bodyResp = JSON.parse(body);
            client.query('SELECT * FROM users WHERE fbuserid = $1', [bodyResp.id], (err, res) =>{
              if(err){
                logger.error('Unexpected error: ' + err);
              }else{
                if(res.rows.length <= 0){
                  logger.error('Unauthorized');
                  response.status(401).json(respuesta.addError(respuestaJson, 401, 'Unauthorized'));
                }else{
                  logger.info('Informacion del usuario');
                  respuestaJson = respuesta.addResult(respuestaJson, 'user', res.rows[0]);
                  response.status(200).json(respuesta.addEntityMetadata(respuestaJson));
                }
              }
            })
          }
        }
        )
      }
    }).catch(e =>{
      logger.error('Unexpected error: ' + e);
      response.status(500).json(respuesta.addError(respuestaJson, 500, 'Unexpected error'));
    })
  }
}

/** @name deleteUser
* @function deleteUser
* @memberof appusers
* @author Gustavo Adrian Gimenez
* @param userId id del usuario que va a ser dado de baja
*/
appusers.deleteUser = function( response, userId){
  var respuestaJson = {};
  const pool = new Pool(db.configDB);
  pool.connect().then(client =>{
    client.query('DELETE FROM users where id = $1 RETURNING *', [userId],(err, res)=>{
      if(err || res.rows.length <= 0 ){
        response.status(404).json(respuesta.addError(respuestaJson, 404, 'No existe el recurso solicitado'));
      }else{
        response.status(201).json(respuesta.addDescription(respuestaJson, 'Baja correcta'));
      }
    });
  }).catch(e =>{
    logger.error('Unexpected error: ' + e.message);
    response.status(500).json(respuesta.addError(respuestaJson, 500, 'Unexpected error'));
  })
}


/** @name getUser
* @function getUser
* @memberof appusers
* @author Gustavo Adrian Gimenez
* @param userID id del usuario del cual se quiere obtener la informacion
*/
appusers.getUser = function( response, userId ){
  var respuestaJson = {};
  var results = [];
  const pool = new Pool(db.configDB);
  pool.connect().then(client =>{
    client.query('SELECT * FROM users WHERE id = $1', [userId], (err, res)=>{
      if(err || res.rows.length <= 0){
        response.status(404).json(respuesta.addError(respuestaJson, 404, 'User inexistente'));
      }else{
        respuestaJson = respuesta.addDescription(respuestaJson, 'Informacion del usuario');
        respuestaJson = respuesta.addResult(respuestaJson, 'user', res.rows[0]);
        response.status(200).json(respuesta.addEntityMetadata(respuestaJson));
      }
    });
  }).catch(e =>{
    response.status(500).json(respuesta.addError(respuestaJson, 500, 'Unexpected error'));
  })
}


/** @name updateUser
* @function updateUser
* @memberof appusers
* @author Gustavo Adrian Gimenez
* @param request Debe contener todos los datos de un usuario incluyendo los no modificados.
*/
appusers.updateUser = function( response, request ){
  var respuestaJson = {};
  if( !request.body.username || !request.body.firstname || !request.body.password || !request.body.birthdate || !request.body.country || !request.body.lastname
        || !request.body.type || !request.body.email || !request.body._ref){
          response.status(400).json(respuesta.addError(respuestaJson, 400, 'Incumplimiento de precondiciones'));
  }else{
    const pool = new Pool(db.configDB);
    pool.connect().then(client =>{
      client.query('SELECT _ref FROM users WHERE id = $1', [request.params.userId], (err, res) =>{
        if(res.rows[0]._ref === request.body._ref ){
          var newJsonUser = {
            username: request.body.username,
            password: request.body.password,
            type: request.body.type,
            firstname: request.body.firstname,
            lastname: request.body.lastname,
            country: request.body.country,
            email: request.body.email,
            birthdate: request.body.birthdate
            }
            var newHash = refHash.generate(newJsonUser);
          client.query('UPDATE users SET username = $1, password = $2, firstname = $3, lastname = $4, type = $5, email = $6, birthdate = $7, country = $8, _ref = $9 WHERE id = $10 RETURNING *',
                    [ request.body.username, request.body.password, request.body.firstname, request.body.lastname, request.body.type, request.body.email, request.body.birthdate,
                    request.body.country, newHash, request.params.userId], (err, res) => {
            if(err){
              response.status(500).json(respuesta.addDescription(respuestaJson, 500, 'Unexpected error'));
            }else{
              respuestaJson = respuesta.addResult(respuestaJson, 'user', res.rows[0]);
              respuestaJson = respuesta.addEntityMetadata(respuestaJson);
              response.status(200).json(respuesta.addDescription(respuestaJson, 'Modificacion correcta'));
            }
          })
        }else{
          response.status(409).json(respuesta.addError(respuestaJson, 'Conflicto en el update (mal valor de ref)'));
        }
      })
    }).catch(e =>{
      logger.error('Unexpected error: ' + e.message);
      response.status(500).json(respuesta.addError(respuestaJson, 500, 'Unexpected error'));
    })
  }
}

module.exports = appusers;
