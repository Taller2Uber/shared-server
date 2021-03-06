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


configDB = {
  user: process.env.DBUSER,
  password: process.env.DBPASSWORD,
  host: process.env.DBHOST,
  port: process.env.DBPORT,
  database: process.env.DBNAME,
  ssl: true,
  //idleTimeoutMillis: 2000,
  //evictionRunIntervalMillis: 1
};



/*
configDB = {
  user: "postgres",
  password: '1234',
  host: 'localhost',
  port: '5432',
  database: 'postgres',
  //ssl: true,
  idleTimeoutMillis: 2000,
  evictionRunIntervalMillis: 1
};*/

var Pool = require('pg-pool')

const pool = new Pool(configDB);

module.exports = () =>  { return pool };
