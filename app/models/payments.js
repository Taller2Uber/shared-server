var logger = require('../config/herokuLogger');
var http = require('http');
var querystring = require('querystring')
var respuesta = require('./respuesta')
require('dotenv').config();

var request = require('request');
var access_token;

/**
 * @class Clase para realizar la comunicacion con la api de pagos
 */

function paymentsDB(){}


/**
* @name getPaymethods
* @function getPaymethods
* @memberof paymentsDB
* @author Gustavo Adrian Gimenez
* @param response Objeto por el cual se realiza la devolucion a la llamada
*/

paymentsDB.getPaymethods = function(response){
  request({
      url: process.env.PAYMENTSROUTE + "/user/oauth/authorize",
      method: "POST",
      headers: {
      },
      json:{
          'client_id': process.env.CLIENT_ID,
          'client_secret' : process.env.CLIENT_SECRET
      }}, function callback(err, res, body){
          if(!err){
              access_token = res.body.access_token;
              request({
                url: "http://shielded-escarpment-27661.herokuapp.com/api/v1/paymethods",
                method: "GET",
                headers: {
                  'authorization' : 'bearer ' + access_token
                }
              }, function(err, res, body){
                  var respuestaJson = {}
                  if(!err){
                    var paymethods = JSON.parse(body);
                    respuestaJson = respuesta.addResult(respuestaJson, 'paymethods', paymethods.items);
                    respuestaJson = respuesta.addCollectionMetadata(respuestaJson, paymethods.items);
                    response.status(200).json(respuestaJson);
                  }else{
                    logger.error(err);
                  }
                })
          }else{
              logger.error(err);
          }
      }
    );
}

/**
* @name getToken
* @function getToken
* @memberof paymentsDB
* @author Gustavo Adrian Gimenez
* @param callback Objeto por el cual se devuelve el token obtenido luego de enviar las credenciales, y asi poder realizar requests.
*/

paymentsDB.getToken = function(callback){
  request({
      url: process.env.PAYMENTSROUTE + "/user/oauth/authorize",
      method: "POST",
      headers: {
      },
      json:{
          'client_id': process.env.CLIENT_ID,
          'client_secret' : process.env.CLIENT_SECRET
      }}, function (err, res, body){
          if(err){
            console.log(err);
            callback(false);
          }else{
              callback(body.access_token);
            }
          })
}


/**
* @name makePay
* @function makePay
* @memberof paymentsDB
* @author Gustavo Adrian Gimenez
* @param payJson Objeto que contiene la informacion que se enviara a la api de pagos para realizar el mismo.
* @param callback Objeto por el cual se devuelve la respuesta obtenida de parte de la api de pagos.
*/

paymentsDB.makePay = function( payJson, callback ){
  request({
      url: process.env.PAYMENTSROUTE + "/user/oauth/authorize",
      method: "POST",
      headers: {
      },
      json:{
          'client_id': process.env.CLIENT_ID,
          'client_secret' : process.env.CLIENT_SECRET
      }}, function (err, resp, body){
          if(err){
            logger.info('Error de autenticacion: ' + err);
            callback(false);
          }else{
              var access_token = resp.body.access_token;
              request({
                url: "http://shielded-escarpment-27661.herokuapp.com/api/v1/payments",
                method: "POST",
                headers: {
                  'authorization' : 'bearer ' + access_token
                },
                json: payJson
              }, function(err, res, body){
                if(res.statusCode == 201){
                  logger.info('Pago realizado correctamente')
                  callback(true)
                }else{
                  logger.error('Error en el pago: ' + err);
                  callback(false);
                }
              })
          }
      }
    );
}

module.exports = paymentsDB;
