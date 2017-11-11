var refCheck = require('./refCheck')
var respuesta = require('./respuesta')
var async = require('asyncawait/async')
var await = require('asyncawait/await')
var logger = require('../config/herokuLogger')
var request = require('request')
var refHash = require('./refCheck')
const connect = require('../config/pgdb')
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
    connect().query('SELECT * FROM users', (err, res) =>{
      res.rows.forEach(userRow =>{
        var cars = [];
        results.push(userRow);
      });
      logger.info('Obteniendo listado de usuarios');
      respuestaJson = respuesta.addCollectionMetadata(respuestaJson, results);
      response.status(200).json(respuesta.addResult(respuestaJson,'users', results));
    })
})


/** @name createUser
* @function createUser
* @memberof appusers
* @author Gustavo Adrian Gimenez
* @param request debe contener todos los datos necesarios para dar de alta un usuario.
*/
appusers.createUser = function( response, req, serverId ){
  var respuestaJson = {};
  if( ((req.body.username && req.body.password ) || req.body.fbtoken )){
      var jsonUser = {"username": req.body.username, "password": req.body.password, "firstname": req.body.firstname, "lastname": req.body.lastname,
      "type": req.body.type, "email": req.body.email, "birthdate": req.body.birthdate, "country": req.body.country, "fbuserid": req.body.fb.userid, "fbtoken": null};

      if( req.body.fb.hasOwnProperty('fbuserid') && req.body.fb.hasOwnProperty('fbtoken')){
        jsonUser.fbuserid = req.body.fb.fbuserid;
        jsonUser.fbtoken = req.body.fb.fbtoken;
      }
      var ref =  refCheck.generate( jsonUser );
      connect().query('INSERT INTO users (username, password, firstname, lastname, type, email, birthdate, country, _ref, fbuserid, fbtoken, applicationowner) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12) RETURNING * ;',
      [req.body.username, req.body.password, req.body.firstname, req.body.lastname, req.body.type, req.body.email, req.body.birthdate, req.body.country, ref, jsonUser.fbuserid, jsonUser.fbtoken, serverId], (err, res) => {
        if(err){
          logger.error('Unexpected error: ' + err);
          response.status(500).json(respuesta.addError(respuestaJson, 500, 'Unexpected error'));
        }else{
          respuestaJson = respuesta.addDescription(respuestaJson, 'Alta correcta');
          respuestaJson = respuesta.addResult(respuestaJson, 'user', res.rows[0]);
          jsonUser._ref = ref;
          response.status(201).json(respuesta.addEntityMetadata(respuestaJson));
        }})
  }else{
    logger.error('Incumplimiento de precondiciones (parámetros faltantes)');
    response.status(400).json(respuesta.addError(respuestaJson, 400, 'Incumplimiento de precondiciones'));
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
  if(  (req.body.username && req.body.password)  || req.body.facebookAuthToken  ){
      if(!req.body.facebookAuthToken){
        connect().query('SELECT * FROM users WHERE username = $1 AND password = $2', [req.body.username, req.body.password], (err, res) =>{
          if( res.rows.length <= 0 ){
            respuestaJson = respuesta.addError(respuestaJson, 401, 'Invalid username or password');
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
        }, function callback(error, res, body){
          var result = JSON.parse(body);
          if(result.hasOwnProperty('error')){
            response.status(401).json(respuesta.addError(respuestaJson, 401, 'Token incorrecto'));
          }else{
            var bodyResp = JSON.parse(body);
            connect().query('SELECT * FROM users WHERE fbuserid = $1', [bodyResp.id], (err, res) =>{
              if(err){
                logger.error('Unexpected error: ' + err);
              }else{
                if(res.rows.length <= 0){
                  logger.info('Token correcto, usuario inexistente');
                  response.status(200).json(respuesta.addDescription(respuestaJson, 'Token correcto, usuario inexistente'));
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
  }else{
    response.status(400).json(respuesta.addError(respuestaJson,400, 'Incumplimiento de precondiciones (parámetros faltantes)'));
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
  connect().query('DELETE FROM users where id = $1 RETURNING *', [userId],(err, res)=>{
    if(err || res.rows.length <= 0 ){
      response.status(404).json(respuesta.addError(respuestaJson, 404, 'No existe el recurso solicitado'));
    }else{
      response.status(201).json(respuesta.addDescription(respuestaJson, 'Baja correcta'));
      }
    });
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
    connect().query('SELECT * FROM users WHERE id = $1', [userId], (err, res)=>{
      if(err || res.rows.length <= 0){
        response.status(404).json(respuesta.addError(respuestaJson, 404, 'User inexistente'));
      }else{
        respuestaJson = respuesta.addDescription(respuestaJson, 'Informacion del usuario');
        respuestaJson = respuesta.addResult(respuestaJson, 'user', res.rows[0]);
        response.status(200).json(respuesta.addEntityMetadata(respuestaJson));
      }
    });
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
      connect().query('SELECT _ref FROM users WHERE id = $1', [request.params.userId], (err, res) =>{
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
          connect().query('UPDATE users SET username = $1, password = $2, firstname = $3, lastname = $4, type = $5, email = $6, birthdate = $7, country = $8, _ref = $9 WHERE id = $10 RETURNING *',
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
  }
}

module.exports = appusers;
