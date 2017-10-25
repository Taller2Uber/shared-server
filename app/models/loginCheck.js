var respuesta = require('../models/respuesta')
var async = require('asyncawait/async')
var await = require('asyncawait/await')
var tokenGenerator = require('./tokenGenerator')
var Pool = require('pg-pool')
var db = require('../config/pgdb')


function loginCheck(){}

loginCheck.buCheck = function( req, res ){
  if( !req.session.authenticated){
    var respuestaJson = {};
    respuestaJson = respuesta.addError(respuestaJson, 401, 'Unauthorized');
    res.status(401).json(respuestaJson);
    return false;
  }else {
    return true;
  }
};

loginCheck.serverCheck = function( token, callback ){

  var serverJson = tokenGenerator.process( token );
  const pool = new Pool(db.configDB);
  var results = [];
  var respuestaJson = {};
  respuestaJson = respuesta.addToken(respuestaJson, token);
  respuestaJson = respuesta.addEntityMetadata( respuestaJson );
  if( serverJson != null ){
    pool.connect().then(client =>{
      client.query('SELECT * FROM appservers WHERE id = $1 AND name = $2', [serverJson.id, serverJson.name], function (err, res){
        res.rows.forEach(row =>{
          results.push(row);
        });

        if ( results.length <= 0 ){
          callback(false, null);
        }else{
          respuestaJson = respuesta.addResult(respuestaJson, results[0]);
          callback(true, respuestaJson);
        }
      })
    })
    .catch(e =>{
      client.release();
      logger.info('Error en la query')
    })
    pool.end();
  }else{
    callback(false, null);
  }
}

loginCheck.businessUserCheck = function( token, callback ){

  var buJson = tokenGenerator.process( token );
  const pool = new Pool(db.configDB);
  var results = [];
  var respuestaJson = {}
  if (buJson != null && buJson.hasOwnProperty('role')){
    pool.connect().then(client =>{
      client.query('SELECT token, role FROM businessusers WHERE id = $1', [buJson.id], function(err, res){
        if(err){
          logger.info('Unexpected error ' + err );
        }else{
        res.rows.forEach(row =>{
          results.push(row);
        })
        if( results.length <= 0 ){
          callback(false, null);
        }else{
          if( results[0].token === token ){
            respuestaJson.role = results[0].role;
            callback(true, respuestaJson);
          }
        }
      }
      })
    }).catch(e =>{
      logger.error('Unexpected error' + e);
    })
  }else{
    callback(false, null);
  }
}

loginCheck.check = function( token, roles, callback ){
  this.serverCheck( token, function( isServer, serverToken ){
    if( isServer == true ){
      callback(true);
    }else{ tokenGenerator.checkBU( token, roles, function( isBU ){
      if (isBU == true){
        callback(true);
      }else{
        callback(false);
      }
    })
    }
  } )
}

module.exports = loginCheck;
