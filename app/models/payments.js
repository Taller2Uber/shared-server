var logger = require('../config/herokuLogger');
var http = require('http');
var querystring = require('querystring')
var respuesta = require('./respuesta')
require('dotenv').config();

var request = require('request');
var access_token;

function paymentsDB(){}

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
                    console.log(err);
                  }
                })
          }else{
              console.log(err);
          }
      }
    );
}

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
