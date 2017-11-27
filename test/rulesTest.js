var assert = require('chai').assert;
var server = require('../server');
var chai = require('chai');
var expect = chai.expect
var chaiHttp = require('chai-http');
var should = chai.should();

chai.use(chaiHttp);

describe('RulesDB', () => {
  describe('Intento obtener todas las reglas', ()=> {
    it('Devuelve status 200', function(done){
      chai.request(server).get('/api/rules').set('token', 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJyb2xlIjoibWFuYWdlciJ9.W7xeouAp5bshEoVvTDOg9K8OmZcCra7vJzPjomZz1JI')
      .end(function(err, res){
        expect(res).to.have.status(200);
        done()
      })
    })
  })
});

describe('RulesDB', () => {
  describe('Intento obtener una regla', ()=> {
    it('Devuelve status 200', function(done){
      chai.request(server).get('/api/rules/11').set('token', 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJyb2xlIjoibWFuYWdlciJ9.W7xeouAp5bshEoVvTDOg9K8OmZcCra7vJzPjomZz1JI')
      .end(function(err, res){
        expect(res).to.have.status(200);
        done()
      })
    })
  })
});

describe('RulesDB', () => {
  describe('Intento crear una regla', ()=> {
    it('Devuelve status 200', function(done){
      var rule = {
        "active":true,
        "blob":'{"priority" : 6,"name": "Balance negativo no puede viajar", "condition": "R.when(this && this.balance < 0);","consequence": "this.tripOk = false; R.stop();"}',
        "language":"node-rules",
        "lastcommit":null
      }
      chai.request(server).post('/api/rules')
      .send(rule).set('token', 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJyb2xlIjoibWFuYWdlciJ9.W7xeouAp5bshEoVvTDOg9K8OmZcCra7vJzPjomZz1JI')
      .end(function(err, res){
        expect(res).to.have.status(201);
        done()
      })
    })
  })
});

//runall

describe('RulesDB', () => {
  describe('Intento crear una regla', ()=> {
    it('Devuelve status 200', function(done){
      var fact = {
        "distance" : 5,
        "mail" : 'mail@mail.com',
        "fecha" : '1567778231223',
        "cost" :0,
        "discount" : 1,
        "tripOk" : true,
        "ownDailyTrips" : 2,
        "totalTrips" : 3,
        "balance" : 1
      }
      chai.request(server).post('/api/rules/runall')
      .send(fact).set('token', 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJyb2xlIjoibWFuYWdlciJ9.W7xeouAp5bshEoVvTDOg9K8OmZcCra7vJzPjomZz1JI')
      .end(function(err, res){
        expect(res).to.have.status(200);
        done()
      })
    })
  })
});
