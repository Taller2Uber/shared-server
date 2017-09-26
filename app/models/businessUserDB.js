const { Client } = require('pg')
const db = require('../config/pgdb')
var logger = require('../config/herokuLogger')


function buDB(){}


buDB.prototype.createBU = function ( res, username, password, name, surname, role ){
  client = new Client({connectionString: db.url, ssl:true});
  client.connect((err) => {
    if(err){
      logger.error('Error critico. No se pudo conectar a la base de datos. Error: ' + err)
    }
    else{
      logger.info('Se conecto a la base de datos correctamente.')
    }
  });

  if( !username || !password || !name || !surname || !role ){
    logger.error('Incumplimiento de precondiciones (parámetros faltantes)');
    res.status(400).send('Incumplimiento de precondiciones (parámetros faltantes)');
  }else{
    client.query('INSERT INTO businessusers (username, password, name, surname, role) VALUES ($1, $2, $3, $4, $5)', [username, password, name, surname, role],(err, res) => {
      console.log(err, res)
    })
    res.status(201).send('Alta correcta');
  }
}

buDB.prototype.getAllBU = function( response, results ){
  client = new Client({connectionString: db.url, ssl:true});
  client.connect((err) => {
    if(err){
      logger.error('Error critico. No se pudo conectar a la base de datos. Error: ' + err);
      response.status(500).send('Unexpected error');
    }
    else{
      logger.info('Se conecto a la base de datos correctamente.')
    }
  });

    var query = client.query('SELECT * FROM businessusers', (err, res) =>{
      res.rows.forEach(row =>{
        results.push(row);
      });
      client.end();
      response.status(200).send(results);
      return(results);
    })
}

buDB.prototype.checkAuth = function( response, request , session){
  if ( !request.body.username || !request.body.password ){
    logger.info('Informacion faltante');
    response.status(500).send('Informacion faltante');
    session = request.session;
    session.authenticated = false;
    return;
  }

  client = new Client({connectionString: db.url, ssl:true});
  client.connect((err) => {
    if(err){
      logger.info('Error critico. No se pudo conectar a la base de datos. Error: ' + err);
      response.status(500).send('Unexpected error');
      return;
    }
    else{
      logger.info('Se conecto a la base de datos correctamente.')
      var results = [];
      client.query('SELECT * FROM businessusers WHERE username = $1 AND password = $2',[request.body.username, request.body.password], (err, res) =>{
        if(err)
          response.send('Error en la query');
        else{
            res.rows.forEach(row =>{
            results.push(row);
            });
          checkLogin(results, response, request, session);
        }
      });
    }
  });
}

function checkLogin(results, response, request, session){
  if( results.length <= 0 ){
    logger.info('Usuario y password incorrectos');
    response.status(500).send('Usuario y password incorrectos');
    client.end();
  } else {
    logger.info('Inicio de sesion correcta');
    session = request.session;
    session.authenticated = true;
    session.role = results[0]['role'];
    session.userId = results[0]['id'];
    response.status(200).send('Inicio de sesion correcta')
    client.end();
  }
}

buDB.prototype.getPersonalInfo = function( response, request ){
  client = new Client({connectionString: db.url, ssl:true});
  client.connect((err) => {
    if(err){
      logger.info('Error critico. No se pudo conectar a la base de datos. Error: ' + err);
      response.status(500).send('Unexpected error');
      return;
    }
    else{
      logger.info("Se conecto a la base de datos correctamente");
      var results = [];
      client.query('SELECT * FROM businessusers WHERE id = $1', [request.session.userId], (err, res) =>{
        if( err )
          response.send('Error en la query');
        else {
            res.rows.forEach(row =>{
            results.push(row);
            });
            if( results.length <= 0 ){
              logger.info('User inexistente');
              response.status(404).send('User inexistente');
            } else {
              logger.info('Obteniendo informacion del usuario');
              response.status(200).json(results[0]);
            }
          }
      });
    }
  })
}


module.exports = buDB;
