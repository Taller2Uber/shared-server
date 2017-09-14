const { Client } = require('pg')
const db = require('../config/pgdb')
var logger = require('../config/logger')


/** @name createUser
* @function createUser
* @author Gustavo Adrian Gimenez
* @param name Nombre del nuevo appserver
* @param token Clave unica de acceso para el nuevo appserver
*/
exports.createUser = function( name, token ){
  client = new Client(db.url);
  client.connect((err) => {
    if(err){
      logger.error('Error critico. No se pudo conectar a la base de datos. Error: ' + err)
    }
    else{
      logger.info('Se conecto a la base de datos correctamente.')
    }
  }); // Se conecta el cliente
  var fecha = new Date().toLocaleString();
  client.query('INSERT INTO appservers (name, token, lastconnection) VALUES ($1, $2, $3) RETURNING name', [name, token, fecha],(err, res) => {
    console.log(err, res)
  })
  //client.end();
};


/** @name getAllUsers
* @function getAllUsers
* @author Gustavo Adrian Gimenez
* @param response Objeto para responder al cliente que solicito la informacion
* @param results Lista para guardar a los users
* @return {List} results Lista de appservers en la base de datos
*/
exports.getAllUsers = function(response, results){
  client = new Client(db.url);
  client.connect((err) => {
    if(err){
      logger.error('Error critico. No se pudo conectar a la base de datos. Error: ' + err)
    }
    else{
      logger.info('Se conecto a la base de datos correctamente.')
    }
  });

  var query = client.query('SELECT * FROM appservers', (err, res) =>{
    res.rows.forEach(row =>{
      results.push(row);
    });
    console.log(results);
    client.end();
    response.json(results);
    return(results);
  })
};


/** @name deleteUser
* @function deleteUser
* @author Gustavo Adrian Gimenez
* @param userId Numero de usuario a borrar
* @param tokenToCheck Clave enviada que debera matchear con el userId para ejecutar la baja
*/
exports.deleteUser = function( userId, tokenToCheck ){
  client = new Client(db.url);
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
          console.log('Error en la query');
          console.log(err);
          client.end();
        }else{
          client.end();
        }
  });

};
