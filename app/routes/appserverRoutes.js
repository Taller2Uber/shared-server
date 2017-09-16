module.exports = function(server){

  var appservCtrl = require ( '../controllers/appservers' );
  var logger = require('../config/herokuLogger.js');

  server.get("/api/users", function( req, res, err ){
    logger.info('Solicitud de obtener todos los appservers');
    appservCtrl.getAll( req, res );

  });

  server.post("/api/users", function( req, res, err){
    logger.info('Solicitud de alta de appserver')
    logger.info("El nombre recibido es: ",req.body.name);
    appservCtrl.create( req.body.name, res );
  });

  server.delete("/api/users/:userId", function( req, res, err){
    logger.info('Solicitud de baja de appserver')
    appservCtrl.deleteUser(req.params.userId, req.body.token, res);
  });


};
