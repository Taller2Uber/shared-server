var respuesta = require('../models/respuesta')
var loginCheck = require('../models/loginCheck')
var path = require('path')
var logger = require('../config/herokuLogger.js')
var rulesDB = require('../models/rulesDB')
var tokenGenerator = require('../models/tokenGenerator');

/**
 * @namespace rulesRoutes
 */

/**
 * @constructor
 * @param {Object} server Servidor express.
 */


rulesRoutes = function(server){

  /**
   * @name post(/rules)
   * @description dar de alta una regla.
   * @memberof rulesRoutes
   * @function POST rules
   * @param request object
   * @param results object
   * @param error object
   */

  server.post('/api/rules', function(req, res, err){
    var respuestaJson = {}
    logger.info('Solicitud de alta de regla');
    //tokenGenerator.checkBU( req.headers.token, ['manager'], function (authorized){
        //if (authorized){
          rulesDB.create(req, res, 210);
        //}else{
        //  respuestaJson = respuesta.addError(respuestaJson, 401, 'Unauthorized')
          //res.status(401).json(respuestaJson);
        //}
    //})
  })

  /**
   * @name get(/rules)
   * @description obtener todas las reglas.
   * @memberof rulesRoutes
   * @function GET rules
   * @param request object
   * @param results object
   * @param error object
   */

  server.get('/api/rules', function(req, res, err){
    logger.info('Solicitud de obtencion de todas las reglas');

    rulesDB.getAll(req, res);
  })

  /**
   * @name get(/rules/:ruleId)
   * @description obtener una regla en particular.
   * @memberof rulesRoutes
   * @function GET rule
   * @param request object
   * @param results object
   * @param error object
   */

  server.get('/api/rules/:ruleId', function(req, res, err){
    logger.info('Solicitud de obtencion de una regla');

    rulesDB.getOne(req, res);
  })

  /**
   * @name post(/rules/runall)
   * @description correr todas las reglas.
   * @memberof rulesRoutes
   * @function POST rules/runAll
   * @param request object
   * @param results object
   * @param error object
   */

  server.post('/api/rules/runall', function(req, res, err){
    logger.info('Solicitud para correr todas las reglas');

    rulesDB.runAll(req, res);
  })

  server.delete('/api/rules/:ruleId', function(req, res, err){
    logger.info('Solicitud para eliminar una regla')

    rulesDB.delete(req, res)
  })

  server.put('/api/rules/:ruleId', function(req, res, err){
    var respuestaJson = {}
    logger.info('Solicitud de alta de regla');
    tokenGenerator.checkBU( req.headers.token, ['manager'], function (isBU, id){
      if ( isBU == true ){
        rulesDB.update(req, res, id);
      }else{
        respuestaJson = respuesta.addError(respuestaJson, 401, 'Unauthorized')
        res.status(401).json(respuestaJson);
      }
    })

  })

  server.get('/api/rules/:ruleId/commits', function(req, res, err){
    logger.info('Solicitud para obtener commits de una regla')

    rulesDB.getAllCommits(req, res);
  })

  server.get('/api/rules/:ruleId/commits/:commitId', function(req, res, err){
    logger.info('Solicitud para obtener un commit')

    rulesDB.getCommit(req, res);
  })

}



module.exports = rulesRoutes;
