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
    logger.info('Solicitud de alta de regla');

    rulesDB.create(req, res);
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

}


module.exports = rulesRoutes;
