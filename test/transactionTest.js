var assert = require('chai').assert;
var server = require('../server');
var chai = require('chai');
var expect = chai.expect
var chaiHttp = require('chai-http');
var should = chai.should();

chai.use(chaiHttp);

describe('transactionTest', () => {
  describe('Intento obtener transacciones', ()=> {
    it('Devuelve status 200', function(done){
      chai.request(server)
      .get('/api/users/71/transactions').set('token', 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJyb2xlIjoidXNlciJ9.LSxbmkvdruuPEePOBfO6kdHISG_GTzt_EJK9B47Dhms')
      .end(function(err, res){
        expect(res).to.have.status(200);
        done()
      })
    })
  })
});

describe('transactionTest', () => {
  describe('Intento crear una transaccion', ()=> {
    it('Devuelve status 201', function(done){
      var transaction = {
        "trip": 8,
        "timestamp": 0,
        "cost": {
          "currency": "ARS",
          "value": 200
        },
        "description": "pago",
        "data": {}
      }
      chai.request(server)
      .post('/api/users/48/transactions')
      .send(transaction).set('token', 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJyb2xlIjoidXNlciJ9.LSxbmkvdruuPEePOBfO6kdHISG_GTzt_EJK9B47Dhms')
      .end(function(err, res){
        expect(res).to.have.status(201);
        done()
      })
    })
  })
});

describe('transactionTest', () => {
  describe('Intento crear una transaccion con parametros faltantes', ()=> {
    it('Devuelve status 400', function(done){
      var transaction = {
        "timestamp": 0,
        "cost": {
          "currency": "ARS",
          "value": 200
        },
        "description": "pago",
        "data": {}
      }
      chai.request(server)
      .post('/api/users/48/transactions')
      .send(transaction).set('token', 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJyb2xlIjoidXNlciJ9.LSxbmkvdruuPEePOBfO6kdHISG_GTzt_EJK9B47Dhms')
      .end(function(err, res){
        expect(res).to.have.status(400);
        done()
      })
    })
  })
});
