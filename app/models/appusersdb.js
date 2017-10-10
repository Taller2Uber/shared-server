const {Client}  = require('pg')
const db = require('../config/pgdb')
var refCheck = require('./refCheck')
var respuesta = require('./respuesta')
var logger = require('../config/herokuLogger')


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
appusers.getAllUsers = function( response, results ){
  var respuestaJson = {};
  client = new Client({connectionString: db.url, ssl:true});
  if( db.connectClient( client, response ) ){
    var query = client.query('SELECT * FROM users', (err, res) =>{
      res.rows.forEach(row =>{
        results.push(row);
      });
      client.end();
      logger.info('Obteniendo listado de usuarios');
      response.status(200).json(respuesta.addResult(respuestaJson, results));
    })
  }else{
    logger.error('Unexpected error');
    response.status(500).json(respuesta.addError(respuestaJson, 500, 'Unexpected error'));
  }
}


/** @name createUser
* @function createUser
* @memberof appusers
* @author Gustavo Adrian Gimenez
* @param request debe contener todos los datos necesarios para dar de alta un usuario.
*/
appusers.createUser = function( response, req ){
  var respuestaJson = {};
  client = new Client({connectionString: db.url, ssl:true});
  if( db.connectClient( client, response ) ){
    if( !req.body.username || !req.body.password || !req.body.firstname || !req.body.type || !req.body.lastname || !req.body.country || !req.body.email || !req.body.birthdate ){
      logger.error('Incumplimiento de precondiciones (parámetros faltantes)');
      response.status(400).json(respuesta.addError(respuestaJson, 400, 'Incumplimiento de precondiciones'));
    }else{
      var jsonUser = {"username": req.body.username, "password": req.body.password, "firstname": req.body.firstname, "lastname": req.body.lastname,
                      "type": req.body.type, "email": req.body.email, "birthdate": req.body.birthdate, "country": req.body.country };
      var ref =  refCheck.generate( jsonUser );
      client.query('INSERT INTO users (username, password, firstname, lastname, type, email, birthdate, country, _ref) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)',
                    [req.body.username, req.body.password, req.body.firstname, req.body.lastname, req.body.type, req.body.email, req.body.birthdate, req.body.country, ref],(err, res) => {
      if(err){
        console.log(err, res)
      }else{
        respuestaJson = respuesta.addDescription(respuestaJson, 'Alta correcta');
        jsonUser._ref = ref;
        response.status(201).json(respuesta.addResult(respuestaJson, jsonUser));
      }})}

  }else{
    response.status(500).json(respuesta.addError(respuestaJson, 500, 'Unexpected error'));
  }
}

/** @name validateUser
* @function validateUser
* @memberof appusers
* @author Gustavo Adrian Gimenez
* @param request debe contener password o facebookAuthToken
*/
appusers.validateUser = function( response, request ){
  var respuestaJson = {};
  client = new Client({connectionString: db.url, ssl:true});
  if( db.connectClient( client, response ) ){
    if( !request.body.username || ( !request.body.password && !request.body.facebookAuthToken) ){
      response.status(400).json(respuesta.addError(respuestaJson,400, 'Incumplimiento de precondiciones (parámetros faltantes)'));
    }else{
      //ACA TENGO QUE HACER QUERY DEL USUARIO, Y VERIFICAR SI EL PASS O EL FBTOKEN ES CORRECTO O NO.
    }
  }else{
    response.status(500).json(respuesta.addError(respuestaJson, 500, 'Unexpected error'));
  }
}

/** @name deleteUser
* @function deleteUser
* @memberof appusers
* @author Gustavo Adrian Gimenez
* @param userId id del usuario que va a ser dado de baja
*/
appusers.deleteUser = function( response, request, userId){
  var respuestaJson = {};
  client = new Client({connectionString: db.url, ssl:true});
  if( db.connectClient( client, response ) ){
    client.query('DELETE FROM users where id = $1 RETURNING *', [userId],(err, res)=>{
      if(err || res.rows.length <= 0 ){
        //respuestaJson = respuesta.addError(respuestaJson, 404, 'No existe el recurso solicitado');
        response.status(404).json(respuesta.addError(respuestaJson, 404, 'No existe el recurso solicitado'));
      }else{
        response.status(201).json(respuesta.addDescription(respuestaJson, 'Baja correcta'));
      }
    });

  }else{
    response.status(500).json(respuesta.addError(respuestaJson, 500, 'Unexpected error'));
  }
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
  client = new Client({connectionString: db.url, ssl:true});
  if( db.connectClient( client, response ) ){
    client.query('SELECT * FROM users WHERE id = $1', [userId], (err, res)=>{
      if(err || res.rows.length <= 0){
        response.status(404).json(respuesta.addError(respuestaJson, 404, 'User inexistente'));
      }else{
        res.rows.forEach(row =>{
          results.push(row);
        })
        respuestaJson = respuesta.addDescription(respuestaJson, 'Informacion del usuario');
        response.status(200).json(respuesta.addResult(respuestaJson, results));
      }
    });
  }else{
    response.status(500).json(respuesta.addError(respuestaJson, 500, 'Unexpected error'));
  }
}


/** @name updateUser
* @function updateUser
* @memberof appusers
* @author Gustavo Adrian Gimenez
* @param request Debe contener todos los datos de un usuario incluyendo los no modificados.
*/
appusers.updateUser = function( response, request ){
  var respuestaJson = {};
  client = new Client({connectionString: db.url, ssl:true});
  if( db.connectClient( client, response ) ){
    if( !request.body.username || !request.body.firstname || !request.body.password || !request.body.birthdate || !request.body.country || !request.body.lastname
          || !request.body.type || !request.body.email){
            response.status(400).json(respuesta.addError(respuestaJson, 400, 'Incumplimiento de precondiciones'));
    }else{
      client.query('UPDATE users SET username = $1, password = $2, firstname = $3, lastname = $4, type = $5, email = $6, birthdate = $7, country = $8 WHERE id = $9',
                [ request.body.username, request.body.password, request.body.firstname, request.body.lastname, request.body.type, request.body.email, request.body.birthdate,
                request.body.country, request.params.userId], (err, res) => {
        if(err){
          response.status(500).json(respuesta.addDescription(respuestaJson, 500, 'Unexpected error'));
        }else{
          response.status(200).json(respuesta.addDescription(respuestaJson, 'Modificacion correcta'));
        }
    })

    }

  }else{
    response.status(500).json(respuesta.addError(respuestaJson, 500, 'Unexpected error'));
  }
}

module.exports = appusers;
