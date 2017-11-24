var assert = require('chai').assert;
var server = require('../server');
var chai = require('chai');
var expect = chai.expect
var chaiHttp = require('chai-http');
var should = chai.should();
var appserverDB = require('../app/models/appserversDB')

chai.use(chaiHttp);

describe('AppserversDatabase', () => {
  describe('Creo correctamente un appserver', ()=> {
    it('Devuelve Alta correcta', function(done){
      let appserverJson = {
        name: "Gustavo"
        }
      chai.request(server).post('/api/servers').set('token', 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJyb2xlIjoibWFuYWdlciJ9.W7xeouAp5bshEoVvTDOg9K8OmZcCra7vJzPjomZz1JI')
      .send(appserverJson)
      .end(function(err, res){
        expect(res).to.have.status(201);
        done()
      })
    })
  })
});


describe('AppserversDatabase', () => {
  describe('Intento crear appserver sin nombre',() => {
    it('Devuelve parametros faltantes...', function(done){
      let appserverJson = {
        name: ''
      }
      chai.request(server).post('/api/servers').set('token', 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJyb2xlIjoibWFuYWdlciJ9.W7xeouAp5bshEoVvTDOg9K8OmZcCra7vJzPjomZz1JI')
      .send(appserverJson)
      .end(function(err,res){
        expect(res).to.have.status(400);
        done()
      })
    })
  });
});

describe('AppserversDatabase', () => {
  describe('Obtener todos los appservers',() => {
    it('Devuelve Ok', function(done){
      chai.request(server).get('/api/servers').set('token', 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJyb2xlIjoidXNlciJ9.LSxbmkvdruuPEePOBfO6kdHISG_GTzt_EJK9B47Dhms')
      .end(function(err, res){
        expect(res).to.have.status(200);
        done()
      })
    })
  });
});

describe('AppserversDatabase', () => {
  describe('Obtener appserver inexistente',() => {
    it('Devuelve status 404 server inexistente', function(done){
      chai.request(server).get('/api/servers/1').set('token', 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJyb2xlIjoidXNlciJ9.LSxbmkvdruuPEePOBfO6kdHISG_GTzt_EJK9B47Dhms')
      .end(function(err, res){
        expect(res).to.have.status(404);
        done()
      })
    })
  });
});

describe('AppserversDatabase', () => {
  describe('Obtener appserver',() => {
    it('Devuelve status 200 Informacion del server', function(done){
      chai.request(server).get('/api/servers/210').set('token', 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJyb2xlIjoidXNlciJ9.LSxbmkvdruuPEePOBfO6kdHISG_GTzt_EJK9B47Dhms')
      .end(function(err, res){
        expect(res).to.have.status(200);
        done()
      })
    })
  });
});


describe('AppserversDatabase', () => {
  describe('Intento actualizar server con ref incorrecto',() => {
    it('Devuelve status 409 Ref incorrecto', function(done){
      let updateServerJson = {
        _ref:''
      }
      chai.request(server).put('/api/servers/210').set('token', 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJyb2xlIjoibWFuYWdlciJ9.W7xeouAp5bshEoVvTDOg9K8OmZcCra7vJzPjomZz1JI')
      .send(updateServerJson)
      .end(function(err, res){
        expect(res).to.have.status(409);
        done()
      })
    })
  });
});

describe('AppserversDatabase', () => {
  describe('Intento borrar server con id incorrecto',() => {
    it('Devuelve status 500 Error', function(done){
      chai.request(server).delete('/api/servers/q').set('token', 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJyb2xlIjoibWFuYWdlciJ9.W7xeouAp5bshEoVvTDOg9K8OmZcCra7vJzPjomZz1JI')
      .end(function(err, res){
        expect(res).to.have.status(500);
        done()
      })
    })
  });
});
