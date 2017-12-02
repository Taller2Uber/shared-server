const connect = require('../config/pgdb')
var respuesta = require('./respuesta')
var logger = require('../config/herokuLogger')
var refHash = require('./refCheck')
var RuleArray = require('./cotizacionDB')
var RuleEngine = require('node-rules')
var request = require('request')


/**
 * @class Clase para manejar la base de datos de reglas
 */

function rulesDB(){}

/**
* @name create
* @function createRule
* @memberof rulesDB
* @author Gustavo Adrian Gimenez
* @param response Objeto por el cual se realiza la devolucion a la llamada
* @param request Objeto que contiene informacion de la llamada realizada por el cliente a la api
*/

rulesDB.create = function(req, response, userId){
  var respuestaJson = {};
  if( !req.body.active || !req.body.language || !req.body.blob){
    logger.error('Incumplimiento de precondiciones');
    response.status(400).json(respuesta.addError(respuestaJson, 400, 'Incumplimiento de precondiciones'));
  }else{
    var ruleJson = JSON.parse(req.body.blob);
    var conditionFunction = new Function('R', ruleJson.condition)
    ruleJson.condition = Object.defineProperty(conditionFunction,'name', {value: 'condition'} );
    var consequenceFunction = new Function('R', ruleJson.consequence)
    ruleJson.consequence = Object.defineProperty(consequenceFunction,'name', {value: 'consequence'} );
    var lastCommit = {}
    connect().query('SELECT * FROM businessusers WHERE id = $1', [userId], (err, res)=>{
      if(err){
        logger.error('Error al obtener datos del usuario: ' + err );
      }else{
        lastCommit.author = res.rows[0];
        lastCommit.message = 'Mensaje de prueba',
        lastCommit.timestamp = new Date().getTime();
        var R1 = new RuleEngine([ruleJson]);
        var store = R1.toJSON()
        var rule = {
          active: req.body.active,
          language: req.body.language,
          lastcommit: lastCommit,
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
    })
  }
}

/**
* @name getAll
* @function getAllRules
* @memberof rulesDB
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
* @memberof rulesDB
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
* @memberof rulesDB
* @author Gustavo Adrian Gimenez
* @param response Objeto por el cual se realiza la devolucion a la llamada
* @param request Objeto que contiene informacion de la llamada realizada por el cliente a la api
*/

rulesDB.update = function(req, response, userId){
  var respuestaJson = {};

  if( !req.body.active || !req.body.language || !req.body._ref){
    logger.error('Incumplimiento de precondiciones');
    response.status(400).json(respuesta.addError(respuestaJson, 400, 'Incumplimiento de precondiciones'));
  }else{
    connect().query('SELECT _ref, blob FROM rules WHERE id = $1', [req.params.ruleId], (err, res)=>{
        if(err){
          logger.error('Unexpected error: ' + err);
          response.status(500).json(respuesta.addError(respuestaJson, 500, 'Unexpected error'));
        }else{
          if( res.rows[0]._ref != req.body._ref){
            logger.error('Conflicto en el update (mal valor de ref)');
            response.status(404).json(respuesta.addError(respuestaJson, 404, 'Conflicto en el update(mal valor de ref)'));
          }else{
            var newRule = {}
            newRule.id = req.params.ruleId;
            newRule.active = req.body.active;
            newRule.language = req.body.language;
            newRule.blob = res.rows[0].blob;
            var newRef = refHash.generate(newRule);
            connect().query('UPDATE rules SET active = $1, language = $2, _ref = $3 WHERE id = $4 RETURNING *',
            [newRule.active, newRule.language, newRef, req.params.ruleId], (err, resu) =>{
              if(err){
                logger.error('Unexpected error: ' + err);
                response.status(500).json(respuesta.addError(respuestaJson, 500, 'Unexpected error'));
              }else{
                respuestaJson = respuesta.addResult(respuestaJson, resu.rows[0]);
                respuestaJson = respuesta.addEntityMetadata(respuestaJson);
                response.status(200).json(respuestaJson);
                //Guardo el commit
                connect().query('SELECT * FROM businessusers WHERE id = $1', [userId], (err, res)=>{
                  if(err){
                    logger.error('Error al generar el registro del commit: ' + err);
                  }else{
                    var lastCommit = {};
                    lastCommit.author = res.rows[0];
                    lastCommit.message = 'Test',
                    lastCommit.timestamp = new Date().getTime();
                    connect().query('INSERT INTO commits (author, message, ruleid, timestamp) VALUES ($1, $2, $3, CURRENT_TIMESTAMP)', [lastCommit.author, lastCommit.message, req.params.ruleId], (err, res)=>{
                        if(err){
                          logger.error('Error al generar el registro del commit: ' + err);
                        }

                    })
                  }
                })
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

  var RuleArray;

  request({
  	url:"https://taller2-grupo7-shared.herokuapp.com/api/rules",
  	method: "GET"
  	}, function(error, res, body){
      var rules = JSON.parse(body);
      var array = []
      RuleArray = new RuleEngine([],{ignoreFactChanges: true})
      for (var rule of rules.rules){
        var ruleCode = rule.blob;
        ruleCode.on = true;
        array.push(ruleCode[0])
      }
      RuleArray.fromJSON(array);

      RuleArray.execute(fact, function(resultado){
        response.status(200).json(resultado);
      })
    })
}

rulesDB.delete = function(req, response){
  var respuestaJson = {}

  connect().query('DELETE FROM rules WHERE id = $1', [req.params.ruleId], (err, res)=>{
    if(err){
      logger.error(err);
      respuestaJson = respuesta.addError(respuestaJson, 500, 'Unexpected error');
      response.status(500).json(respuestaJson);
    }else{
      respuestaJson = respuesta.addDescription(respuestaJson, 'Baja correcta')
      response.status(200).json(respuestaJson)
    }
  })
}

rulesDB.run = function(req, response){}

rulesDB.getAllCommits = function(req, response){
  var respuestaJson = {}
  var results = []

  connect().query('SELECT * FROM commits WHERE ruleid = $1', [req.params.ruleId], (err, res)=>{
    if(err){
      logger.error('Unexpected error: ' + err);
      response.status(500).json(respuesta.addError(respuestaJson, 500, 'Unexpected error'));
    }else{
      res.rows.forEach(row =>{
        results.push(row);
      })
      respuestaJson = respuesta.addResult(respuestaJson, 'commits', results)
      respuestaJson = respuesta.addCollectionMetadata(respuestaJson, results)
      response.status(200).json(respuestaJson);
    }
  })
}

rulesDB.getCommit = function(req, response){
  var respuestaJson = {}
  var results = []

  connect().query('SELECT * FROM commits WHERE id = $1 AND ruleid = $2', [req.params.commitId, req.params.ruleId], (err, res)=>{
    if(err){
      logger.error('Unexpected error: ' + err);
      response.status(500).json(respuesta.addError(respuestaJson, 500, 'Unexpected error'));
    }else{
      res.rows.forEach(row =>{
        results.push(row);
      })
      respuestaJson = respuesta.addResult(respuestaJson, 'commits', results)
      respuestaJson = respuesta.addCollectionMetadata(respuestaJson, results)
      response.status(200).json(respuestaJson);
    }
  })
}

module.exports = rulesDB;
