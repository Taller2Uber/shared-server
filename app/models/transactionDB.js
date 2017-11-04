const pg = require('pg')
var Pool = require('pg-pool')
const db = require('../config/pgdb')
var respuesta = require('./respuesta')
var logger = require('../config/herokuLogger')

function transactionDB(){}

transactionDB.create = function(req, response){
  var respuestaJson = {}
  var trans = req.body.trans;
  if( !req.body.trans || !trans.trip || !trans.cost || !trans.timestamp || !trans.description || !trans.data ){
    logger.error('Incumplimiento de precondiciones (parametros faltantes)');
    response.status(400).json(respuesta.addError(respuestaJson, 400, 'Incumplimiento de precondiciones'));
  }else{
    const pool = new Pool(db.configDB);
    pool.connect().then(client =>{
      client.query('INSERT INTO transactions (trip, timestamp, description, cost, data, userid) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *',
      [trans.trip, trans.timestamp, trans.description, JSON.stringify(trip.cost), JSON.stringify(trip.data), req.params.userid], (err, res)=>{
        if(err){
          logger.error('Unexpected error: '+ err);
          response.status(500).json(respuesta.addError(respuestaJson, 500, 'Unexpected error'));
        }else{
          logger.info('Alta correcta');
          respuestaJson = respuesta.addResult(respuestaJson, 'transaction', res);
          respuestaJson = respuesta.addEntityMetadata(respuestaJson);
          response.status(201).json(respuestaJson);
        }
      })
    }).catch(e =>{
      logger.error('Unexpected error');
      respuestaJson = respuesta.addError(respuestaJson, 500, 'Unexpected error');
      response.status(500).json(respuestaJson);
    })
  }
}


transactionDB.getAll = function(req, response){
  var respuestaJson = {};
  var results = [];
  var pool = new Pool(db.configDB);
  pool.connect().then(client =>{
    client.quert('SELECT * FROM transactions WHERE userid = $1', [req.params.userId], (err, res)=>{
      if(err){
          logger.error('Unexpected error: ' + err);
          response.status(500).json(respuesta.addError(respuestaJson, 500, 'Unexpected error'));
      }else{
        res.rows.forEach(row =>{
          results.push(row);
        })
        logger.info('Obtencion de las transacciones');
        respuestaJson = respuesta.addResult(respuestaJson, 'transactions', results);
        respuestaJson = respuesta.addCollectionMetadata(respuestaJson, results);
        response.status(200).json(respuestaJson);
      }
    })
  }).catch(e =>{
    logger.error('Unexpected error: ' + e);
    response.status(500).json(respuesta.addError(respuestaJson, 500, 'Unexpected error'));
  })
}
