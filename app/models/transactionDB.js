const pg = require('pg')
var Pool = require('pg-pool')
const db = require('../config/pgdb')
var respuesta = require('./respuesta')
var logger = require('../config/herokuLogger')

function transactionDB(){}

transactionDB.create = function(req, response){
  var respuestaJson = {}
  if( !req.body.trip || !req.body.cost  /*||  !req.body.timestamp */){
    logger.error(JSON.stringify(req.body));
    logger.error('Incumplimiento de precondiciones (parametros faltantes)');
    response.status(400).json(respuesta.addError(respuestaJson, 400, 'Incumplimiento de precondiciones'));
  }else{
    const pool = new Pool(db.configDB);
    pool.connect().then(client =>{
      client.query('INSERT INTO transactions (trip, timestamp, description, cost, data, userid) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *',
      [req.body.trip, req.body.timestamp, req.body.description, JSON.stringify(req.body.cost), JSON.stringify(req.body.data), req.params.userId], (err, res)=>{
        if(err){
          logger.error('Unexpected error: '+ err);
          response.status(500).json(respuesta.addError(respuestaJson, 500, 'Unexpected error'));
        }else{
          logger.info('Alta correcta');
          respuestaJson = respuesta.addResult(respuestaJson, 'transaction', res.rows[0]);
          respuestaJson = respuesta.addEntityMetadata(respuestaJson);
          this.addCost(req.params.userId, req.body.cost.currency, req.body.cost.value, response);
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

transactionDB.addCost = function(userId, currency, value, response){
  var respuestaJson = {};
  var balanceItem = {};
  var user = {}
  var Balance = [];
  balanceItem.currency = currency;
  balanceItem.value = value;
  var pool = new Pool(db.configDB);
  pool.connect().then(client =>{
    pool.query('SELECT balance FROM users WHERE id = $1', [userId], (err, res)=> {
      if( res.rows[0].balance != null ){
        Balance = res.rows[0].balance;
        var contador = -1;
        var index = -1;
        for( var item of Balance ){
          contador = contador + 1;
          if( item.currency == balanceItem.currency ){
            index = contador;
            balanceItem.value += item.value;
          }
        }
      }
      if( index == -1 ){
          Balance.push(balanceItem);
          var balanceToSave = JSON.stringify(Balance);
          pool.query('UPDATE users SET balance = $2 WHERE id = $1', [userId, balanceToSave], (err, res)=> {
            if(err){
              logger.error(err);
            }else{
              logger.info('Transaccion realizada correctamente');
            }
          })
      }else{
        Balance.splice(index, 1);
        Balance.push(balanceItem);
        var balanceToSave = JSON.stringify(Balance);
        pool.query('UPDATE users SET balance = $2 WHERE id = $1', [userId, balanceToSave], (err, res)=> {
          if(err){
            logger.error(err);
          }else{
            logger.info('Transaccion realizada correctamente');
          }
        })
      }
    })
  })
}


transactionDB.getAll = function(req, response){
  var respuestaJson = {};
  var results = [];
  var pool = new Pool(db.configDB);
  pool.connect().then(client =>{
    client.query('SELECT * FROM transactions WHERE userid = $1', [req.params.userId], (err, res)=>{
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

module.exports = transactionDB;
