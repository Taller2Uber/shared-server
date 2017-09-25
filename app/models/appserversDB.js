const { Client } = require('pg')
const db = require('../config/pgdb')
var logger = require('../config/herokuLogger')

function appserverDB(){}


/** @name createUser
* @function createUser
* @author Gustavo Adrian Gimenez
* @param name Nombre del nuevo appserver
* @param token Clave unica de acceso para el nuevo appserver
*/
appserverDB.prototype.createServer = function( response, name, token ){
  if(!name)
    response.status(400).send('Incumplimiento de precondiciones (parámetros faltantes)');
  else{

    client = new Client({connectionString: db.url, ssl:true});
    client.connect((err) => {
      if(err){
        logger.error('Error critico. No se pudo conectar a la base de datos. Error: ' + err)
      }
      else{
        logger.info('Se conecto a la base de datos correctamente.')
      }
    }); // Se conecta el cliente
    var fecha = new Date();
    client.query('INSERT INTO appservers (name, createdBy, createdTime, lastConnection, token) VALUES ($1, $2, $3, $4, $5) RETURNING name', [name, 'me', fecha, fecha, token],(err, res) => {
      console.log(err, res)
    })
    response.status(201).send('Alta correcta');
  }
};


/** @name getAllUsers
* @function getAllUsers
* @author Gustavo Adrian Gimenez
* @param response Objeto para responder al cliente que solicito la informacion
* @param results Lista para guardar a los users
* @return {List} results Lista de appservers en la base de datos
*/
appserverDB.prototype.getAllServers = function(response, results){
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

  var query = client.query('SELECT * FROM appservers', (err, res) =>{
    res.rows.forEach(row =>{
      results.push(row);
    });
    client.end();
    response.status(200).send(results);
    return(results);
  })
};


/** @name deleteUser
* @function deleteUser
* @author Gustavo Adrian Gimenez
* @param userId Numero de usuario a borrar
* @param tokenToCheck Clave enviada que debera matchear con el userId para ejecutar la baja
*/
appserverDB.prototype.deleteServer = function( response, userId, tokenToCheck ){
  client = new Client({connectionString: db.url, ssl:true});
  client.connect((err) => {
    if(err){
      logger.error('Error critico. No se pudo conectar a la base de datos. Error: ' + err)
    }
    else{
      logger.info('Se conecto a la base de datos correctamente.')
    }
  });
  var query = client.query('DELETE FROM appservers WHERE id =  $1 AND token =  $2',[userId, tokenToCheck], ( err, res) =>{
    //checkear errores
        if(err){
          console.log(err);
          client.end();
        }else{
          response.status(200).send('Fin de la operacion');
          client.end();
        }
  });
};

module.exports = appserverDB;
