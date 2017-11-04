var logger = require('../config/herokuLogger.js')
var respuesta = require('../models/respuesta')
var getPaymethods = require('../models/payments')
var loginCheck = require('../models/loginCheck')


paymethodsRoutes = function(server){

  server.get('/api/paymethods', function(req, res, err){
    logger.info('Obtencion de todos los metodos de pago');
    loginCheck.check( req.headers.token, [], function( authorized){
      if( authorized == true ){
        getPaymethods(res);
      }else{
        logger.error('Unauthorized');
        res.status(409).json({'message':'Unauthorized'});
      }
    })
  })

}

module.exports = paymethodsRoutes;
