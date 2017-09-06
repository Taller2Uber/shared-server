const { Pool, Client } = require('pg')
const db = require('../config/pgdb')

const client = new Client({
  user: 'grupo7',
  host: 'localhost',
  database: 'LlevameDb',
  password: '7552',
  port: 5432,
})

//client.connect();

/*const query = client.query(
  'INSERT INTO appservers (name, token, lastconnection) VALUES ( "Gustavo", "tokenTest", "dateTest");');
client.end();*/

/*client.query('INSERT INTO appservers (name, token, lastconnection) VALUES ($1, $2, $3) RETURNING name', ["RAUL", "otroToken", "otroDate"], (err, res) => {
  console.log(err, res)
  client.end()
})*/

exports.createUser = function( name, token ){
  client.connect();
  var fecha = new Date().toLocaleString();
  client.query('INSERT INTO appservers (name, token, lastconnection) VALUES ($1, $2, $3) RETURNING name', [name, token, fecha],(err, res) => {
    console.log(err, res)
    //client.end()
  })
};

exports.getAllUsers = function(response, results){
  client.connect();

  var query = client.query('SELECT * FROM appservers', (err, res) =>{
    res.rows.forEach(row =>{
      results.push(row);
    });
    //client.end();
    console.log(results);
    response.json(results);
    return(results);
  })
};
