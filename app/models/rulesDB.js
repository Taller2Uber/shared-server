const connect = require('../config/pgdb')
var respuesta = require('./respuesta')
var logger = require('../config/herokuLogger')
var refHash = require('./refCheck')
var RuleArray = require('./cotizacionDB')
var RuleEngine = require('node-rules')


/**
 * @class Clase para manejar la base de datos de reglas
 */

function rulesDB(){}

/**
* @name create
* @function createRule
* @memberof rulessDB
* @author Gustavo Adrian Gimenez
* @param response Objeto por el cual se realiza la devolucion a la llamada
* @param request Objeto que contiene informacion de la llamada realizada por el cliente a la api
*/

rulesDB.create = function(req, response){
  var respuestaJson = {};
  if( !req.body.active || !req.body.language || !req.body.blob){
    logger.error('Incumplimiento de precondiciones');
    response.status(400).json(respuesta.addError(respuestaJson, 400, 'Incumplimiento de precondiciones'));
  }else{
    var ruleJson = JSON.parse('{"priority" : 6,"name": "Balance negativo no puede viajar", "condition": "R.when(this && this.balance < 0);","consequence": "this.tripOk = false; R.stop();"}')
    var conditionFunction = new Function('R', ruleJson.condition)
    ruleJson.condition = Object.defineProperty(conditionFunction,'name', {value: 'condition'} );
    var consequenceFunction = new Function('R', ruleJson.consequence)
    ruleJson.consequence = Object.defineProperty(consequenceFunction,'name', {value: 'consequence'} );
    var R1 = new RuleEngine([ruleJson]);
    var store = R1.toJSON()
    console.log(store)
    var rule = {
      active: req.body.active,
      language: req.body.language,
      lastcommit: req.body.lastcommit,
      blob: store
    };
    var ruleRef = refHash.generate( rule );
    connect().query('INSERT INTO rules (active, language, lastcommit, blob, _ref) VALUES ($1, $2, $3, $4, $5) RETURNING *',
      [rule.active, rule.language, JSON.stringify(rule.lastcommit), JSON.stringify(rule.blob), ruleRef], (err, res)=>{
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
  }
}

/**
* @name getAll
* @function getAllRules
* @memberof rulessDB
* @author Gustavo Adrian Gimenez
* @param response Objeto por el cual se realiza la devolucion a la llamada
* @param request Objeto que contiene informacion de la llamada realizada por el cliente a la api
*/

rulesDB.getAll = function(req, response){
  var respuestaJson = {};
  var results = [];
  connect().query('SELECT * FROM rules', (err, res)=> {
      if(err){
        logger.error('Unexpected error: ' + err);
        response.status(500).json(respuesta.addError(respuestaJson, 500, 'Unexpected error'));
      }else{
        res.rows.forEach(row =>{
          results.push(row);
          if(row.id == 5){
            console.log(row.blob);

          }
        })
        logger.info('Obtencion de todas las reglas');
        respuestaJson = respuesta.addResult(respuestaJson, 'rules', results);
        respuestaJson = respuesta.addCollectionMetadata(respuestaJson, results);
        response.status(200).json(respuestaJson);
      }
    })
}

/**
* @name getOne
* @function getOneRule
* @memberof rulessDB
* @author Gustavo Adrian Gimenez
* @param response Objeto por el cual se realiza la devolucion a la llamada
* @param request Objeto que contiene informacion de la llamada realizada por el cliente a la api
*/

rulesDB.getOne = function(req, response){
  var respuestaJson = {};
  connect().query('SELECT * FROM rules WHERE id = $1', [req.params.ruleId], (err, res)=>{
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
}

/**
* @name update
* @function updateRule
* @memberof rulessDB
* @author Gustavo Adrian Gimenez
* @param response Objeto por el cual se realiza la devolucion a la llamada
* @param request Objeto que contiene informacion de la llamada realizada por el cliente a la api
*/

rulesDB.update = function(req, response){
  var respuestaJson = {};

  if( !req.body.active || !req.body.language || !req.body.lastcommit || !req.body.blob || !req.body._ref){
    logger.error('Incumplimiento de precondiciones');
    response.status(400).json(respuesta.addError(respuestaJson, 400, 'Incumplimiento de precondiciones'));
  }else{
    connect().query('SELECT _ref FROM rules WHERE id = $1', [req.params.ruleId], (err, res)=>{
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
            connect().query('UPDATE rules SET active = $1, language = $2, lastcommit = $3, blob = $4, _ref = $5 WHERE id = $6 RETURNING *',
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
  }
}

rulesDB.runAll = function(req, response){
  var fact = {}
  fact.distance = req.body.distance;
  fact.mail = req.body.mail;
  fact.fecha = req.body.fecha;
  fact.cost = 0;
  fact.discount = 1;
  fact.tripOk = true;
  fact.ownDailyTrips = req.body.ownDailyTrips;
  fact.totalTrips = req.body.totalTrips;
  fact.balance = req.body.balance;

  RuleArray.execute(fact, function(resultado){
    response.status(200).json(resultado);
  })

}

rulesDB.run = function(req, response){}

rulesDB.getAllCommits = function(req, response){}

rulesDB.getCommit = function(req, response){}

module.exports = rulesDB;
