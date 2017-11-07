var respuesta = require('../models/respuesta')
var loginCheck = require('../models/loginCheck')
var path = require('path')
var logger = require('../config/herokuLogger.js')
var rulesDB = require('../models/rulesDB')
var tokenGenerator = require('../models/tokenGenerator');

rulesRoutes = function(server){

  server.post('/api/rules', function(req, res, err){
    logger.info('Solicitud de alta de regla');

    rulesDB.create(req, res);
  })

  server.get('/api/rules', function(req, res, err){
    logger.info('Solicitud de obtencion de todas las reglas');

    rulesDB.getAll(req, res);
  })

  server.get('/api/rules/:ruleId', function(req, res, err){
    logger.info('Solicitud de obtencion de una regla');

    rulesDB.getOne(req, res);
  })

  server.post('/api/rules/runall', function(req, res, err){
    logger.info('Solicitud para correr todas las reglas');

    rulesDB.runAll(req, res);
  })

}


module.exports = rulesRoutes;
