/**
* @module
* @name pgdb
* @author Gustavo Adrian Gimenez
* @description Objetivo: abstraer la URL de acceso a la base de datos del resto de la aplicacion
*/

const  Client  = require('pg');
var async = require('asyncawait/async');
var logger = require('../config/herokuLogger');
require('dotenv').config();

function testFunction(a, b){
  return (a+b);
};

connectClient = async (function( client , response){
  client.connect( (err) =>{
    if( err ){
      logger.info('Error critico. No se pudo conectar a la base de datos. Error: ' + err);
      response.status(500).send('Unexpected error');
      return false;
    }else{
      return true;
    }
  })
})

configDB = {
  user: process.env.DBUSER,
  password: process.env.DBPASSWORD,
  host: process.env.DBHOST,
  port: process.env.DBPORT,
  database: process.env.DBNAME,
  ssl: true
};

module.exports = {
       url: "postgres://yaholwwedufvfk:fedbb72f52839ff52bba98223c057bddd0652e851876158009099daf78231b7d@ec2-184-72-248-8.compute-1.amazonaws.com:5432/d9v0pdccnsqeju",
       testFunction,
       connectClient,
       configDB

}
