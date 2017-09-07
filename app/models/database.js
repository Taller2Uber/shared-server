const { Pool, Client } = require('pg')
const db = require('../config/pgdb')

const client = new Client({
  user: 'grupo7',
  host: 'localhost',
  database: 'LlevameDb',
  password: '7552',
  port: 5432,
})


exports.createUser = function( name, token ){
  client.connect();
  var fecha = new Date().toLocaleString();
  client.query('INSERT INTO appservers (name, token, lastconnection) VALUES ($1, $2, $3) RETURNING name', [name, token, fecha],(err, res) => {
    console.log(err, res)
  })
};

exports.getAllUsers = function(response, results){
  client.connect();

  var query = client.query('SELECT * FROM appservers', (err, res) =>{
    res.rows.forEach(row =>{
      results.push(row);
    });
    console.log(results);
    response.json(results);
    return(results);
  })
};


exports.deleteUser = function( userId, tokenToCheck ){
  client.connect();
  console.log('Antees de la query' + userId + '   ' + tokenToCheck)
  var query = client.query('DELETE FROM appservers WHERE id =  $1 AND token =  $2',[userId, tokenToCheck], ( err, res) =>{
    //checkear errores
        if(err){
          console.log('Error en la query' + tokenToCheck);
          console.log(err);
        }else{
          console.log('paso la query');
          console.log('Se borro correctamente');
          return;
        }
  });

};
