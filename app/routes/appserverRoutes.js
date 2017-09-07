module.exports = function(server){

  var appservCtrl = require ( '../controllers/appservers' );

  server.get("/api/users", function( req, res, err ){

    appservCtrl.getAll( req, res );

  });

  server.post("/api/users", function( req, res, err){
    console.log("El nombre recibido es: ",req.body.name);
    appservCtrl.create( req.body.name, res );
  });

  server.delete("/api/users/:userId", function( req, res, err){
    appservCtrl.deleteUser(req.params.userId, req.body.token);
  });


};
