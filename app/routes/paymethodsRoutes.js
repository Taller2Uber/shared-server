var logger = require('../config/herokuLogger.js')
var respuesta = require('../models/respuesta')
var paymentsDB = require('../models/payments')
var loginCheck = require('../models/loginCheck')


paymethodsRoutes = function(server){

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

  server.get('/api/testToken', function(req, res, err){
    paymentsDB.getToken(function(token){
      console.log('paso')
    })
  })
}

module.exports = paymethodsRoutes;
