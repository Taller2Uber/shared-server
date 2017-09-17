const { Client } = require('pg')
const db = require('../config/pgdb')
var logger = require('../config/herokuLogger')


/** @name createUser
* @function createUser
* @author Gustavo Adrian Gimenez
* @param name Nombre del nuevo appserver
* @param token Clave unica de acceso para el nuevo appserver
*/
exports.createUser = function( name, token ){
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
};


/** @name getAllUsers
* @function getAllUsers
* @author Gustavo Adrian Gimenez
* @param response Objeto para responder al cliente que solicito la informacion
* @param results Lista para guardar a los users
* @return {List} results Lista de appservers en la base de datos
*/
exports.getAllUsers = function(response, results){
  client = new Client({connectionString: db.url, ssl:true});
  client.connect((err) => {
    if(err){
      logger.error('Error critico. No se pudo conectar a la base de datos. Error: ' + err);
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
exports.deleteUser = function( userId, tokenToCheck ){
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
          console.log('Error en la query');
          console.log(err);
          client.end();
        }else{
          client.end();
        }
  });

};
