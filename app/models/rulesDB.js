const pg = require('pg')
var Pool = require('pg-pool')
const db = require('../config/pgdb')
var respuesta = require('./respuesta')
var logger = require('../config/herokuLogger')
var refHash = require('./refCheck')

function rulesDB(){}
//active, language, lastcommit,blob
rulesDB.create = function(req, response){
  var respuestaJson = {};

  if( !req.body.active || !req.body.language || !req.body.lastcommit || !req.body.blob){
    logger.error('Incumplimiento de precondiciones');
    response.status(400).json(respuesta.addError(respuestaJson, 400, 'Incumplimiento de precondiciones'));
  }else{
    var rule = {
      active: req.body.active,
      language: req.body.language,
      lastcommit: req.body.lastcommit,
      blob: req.body.blob
    };
    var ruleRef = refHash.generate( rule );
    const pool = new Pool(db.configDB);
    pool.connect().then(client =>{
      client.query('INSERT INTO rules (active, language, lastcommit, blob, _ref) VALUES ($1, $2, $3, $4, $5) RETURNING *',
      [rule.active, rule.language, JSON.stringify(rule.lastcommit), rule.blob, ruleRef], (err, res)=>{
        if(err){
          logger.error('Unexpected error:' + err);
          response.status(500).json(respuesta.addError(respuestaJson, 500, 'Unexpected error'));
        }else{
          logger.info('Alta correcta');
          respuestaJson = respuesta.addResult(respuestaJson, 'rule', res.rows[0]);
          respuestaJson = respuesta.addEntityMetadata(respuestaJson);
          response.status(201).json(respuestaJson);
        }
      })
    }).catch(e =>{
      logger.error('Unexpected error:' + e);
      response.status(500).json(respuesta.addError(respuestaJson, 500, 'Unexpected error'));
    })
  }
}

rulesDB.getAll = function(req, response){
  var respuestaJson = {};
  var results = [];
  const pool = new Pool(db.configDB);
  pool.connect().then(client =>{
    client.query('SELECT * FROM rules', (err, res)=> {
      if(err){
        logger.error('Unexpected error: ' + err);
        response.status(500).json(respuesta.addError(respuestaJson, 500, 'Unexpected error'));
      }else{
        res.rows.forEach(row =>{
          results.push(row);
        })
        logger.info('Obtencion de todas las reglas');
        respuestaJson = respuesta.addResult(respuestaJson, 'rules', results);
        respuestaJson = respuesta.addCollectionMetadata(respuestaJson, results);
        response.status(200).json(respuestaJson);
      }
    })
  }).catch(e =>{
    logger.error('Unexpected error: ' + e);
    response.status(500).json(respuesta.addError(respuestaJson, 500, 'Unexpected error'));
  })
}

rulesDB.getOne = function(req, response){
  var respuestaJson = {};

  const pool = new Pool(db.configDB);
  pool.connect().then(client =>{
    client.query('SELECT * FROM rules WHERE id = $1', [req.params.ruleId], (err, res)=>{
      if(err){
        logger.error('Unexpected error: ' + err);
        response.status(500).json(respuesta.addError(respuestaJson, 500, 'Unexpected error'));
      }else{
        if( res.rows.length <= 0 ){
          logger.info('Regla inexistente');
          response.status(404).json(respuesta.addDescription(respuestaJson, 'Regla inexistente'));
        }else{
          logger.info('Obtencion de regla');
          respuestaJson = respuesta.addResult(respuestaJson, 'rule', res.rows[0]);
          respuestaJson = respuesta.addEntityMetadata(respuestaJson);
          response.status(200).json(respuestaJson);
        }
      }
    })
  }).catch(e =>{
    logger.error('Unexpected error: '+ e);
    response.status(500).json(respuesta.addError(respuestaJson, 500, 'Unexpected error'));
  })
}

rulesDB.update = function(req, response){
  var respuestaJson = {};

  if( !req.body.active || !req.body.language || !req.body.lastcommit || !req.body.blob || !req.body._ref){
    logger.error('Incumplimiento de precondiciones');
    response.status(400).json(respuesta.addError(respuestaJson, 400, 'Incumplimiento de precondiciones'));
  }else{
    const pool = new Pool(db.configDB);
    pool.connect().then(client =>{
      client.query('SELECT _ref FROM rules WHERE id = $1', [req.params.ruleId], (err, res)=>{
        if(err){
          logger.error('Unexpected error: ' + err);
          response.status(500).json(respuesta.addError(respuestaJson, 500, 'Unexpected error'));
        }else{
          if( res.rows[0]._ref != req.body._ref){
            logger.error('Conflicto en el update (mal valor de ref)');
            response.status(404).json(respuesta.addError(respuestaJson, 404, 'Conflicto en el update(mal valor de ref)'));
          }else{
            logger.info('Actualizacion de regla');
            var newRule = {
              active:req.body.active,
              language:req.body.language,
              lastcommit:req.body.lastcommit,
              blob:req.body.blob
            }
            var newRef = refHash.generate(newRule);
            client.query('UPDATE rules SET active = $1, language = $2, lastcommit = $3, blob = $4, _ref = $5 WHERE id = $6 RETURNING *',
            [newRule.active, newRule.language, JSON.stringify(newRule.lastcommit), newRule.blob, newRef, req.params.ruleId], (err, resu) =>{
              if(err){
                logger.error('Unexpected error: ' + err);
                response.status(500).json(respuesta.addError(respuestaJson, 500, 'Unexpected error'));
              }else{
                respuestaJson = respuesta.ddResult(respuestaJson, resu.rows[0]);
                respuestaJson = respuesta.addEntityMetadata(respuestaJson);
                response.status(200).json(respuestaJson);
              }
            })
          }
        }
      })
    }).catch(e =>{
      logger.error('Unexpected error: '+ e);
      response.status(500).json(respuesta.addError(respuestaJson, 500, 'Unexpected error'));
    })
  }

}

rulesDB.runAll = function(req, response){}

rulesDB.run = function(req, response){}

rulesDB.getAllCommits = function(req, response){}

rulesDB.getCommit = function(req, response){}

module.exports = rulesDB;
