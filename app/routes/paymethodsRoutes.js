var logger = require('../config/herokuLogger.js')
var respuesta = require('../models/respuesta')
var paymentsDB = require('../models/payments')
var loginCheck = require('../models/loginCheck')

/**
 * @namespace paymethodsRoutes
 */

 /**
  * @constructor
  * @param {Object} server Servidor express.
  */

paymethodsRoutes = function(server){

  /**
   * @name get(/paymethods)
   * @description obtener todos los metodos de pago disponibles.
   * @memberof paymethodsRoutes
   * @function GET paymethods
   * @param request object
   * @param results object
   * @param error object
   */

  server.get('/api/paymethods', function(req, res, err){
    logger.info('Obtencion de todos los metodos de pago');
    loginCheck.check( req.headers.token, ['user'], function( authorized){
      if( authorized == true ){
        paymentsDB.getPaymethods(res);
      }else{
        logger.error('Unauthorized');
        res.status(409).json({'message':'Unauthorized'});
      }
    })
  })

  server.post('/api/testPay', function(req, res, err){

    paymentsDB.makePay(req.body, function(result){
      if(result){
        logger.info('PayOk')
      }else{
        logger.info('Pay Not Ok')
      }
    })

  })

}

module.exports = paymethodsRoutes;
