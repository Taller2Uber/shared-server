module.exports = function(server){

  server.use(function( req, res, err ){
    res.status(404).send('La pagina solicitada no existe');
  });

};
