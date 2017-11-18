var assert = require('chai').assert;
var server = require('../server');
var chai = require('chai');
var chaiHttp = require('chai-http');
var should = chai.should();

chai.use(chaiHttp);

describe('AppserversDatabase', () => {
  describe('Creo correctamente un appserver', ()=> {
    it('Devuelve Alta correcta', function(){
      let appserverJson = {
        name: "Gustavo"
        }
      chai.request(server).post('/api/servers').set('token', 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJyb2xlIjoibWFuYWdlciJ9.W7xeouAp5bshEoVvTDOg9K8OmZcCra7vJzPjomZz1JI')
      .send(appserverJson)
        .end((err, res) => {
          res.should.have.status(201);
        });
    })
  })
});


describe('AppserversDatabase', () => {
  describe('Intento crear appserver sin nombre',() => {
    it('Devuelve parametros faltantes...', function(){
      let appserverJson = {
        name: ''
      }
      chai.request(server).post('/api/servers').set('token', 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJyb2xlIjoibWFuYWdlciJ9.W7xeouAp5bshEoVvTDOg9K8OmZcCra7vJzPjomZz1JI')
      .send(appserverJson)
      .end((err, res) => {
        res.should.have.status(400);
      })
    })
  });
});

describe('AppserversDatabase', () => {
  describe('Obtener todos los appservers',() => {
    it('Devuelve Ok', function(){
      chai.request(server).get('/api/servers').set('token', 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJyb2xlIjoidXNlciJ9.LSxbmkvdruuPEePOBfO6kdHISG_GTzt_EJK9B47Dhms')
      .end((err, res) => {
        res.should.have.status(200);
      })
    })
  });
});

describe('AppserversDatabase', () => {
  describe('Obtener appserver inexistente',() => {
    it('Devuelve status 404 server inexistente', function(){
      chai.request(server).get('/api/servers/1').set('token', 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJyb2xlIjoidXNlciJ9.LSxbmkvdruuPEePOBfO6kdHISG_GTzt_EJK9B47Dhms')
      .end((err, res) => {
        res.should.have.status(404);
      })
    })
  });
});
/*
describe('AppserversDatabase', () => {
  describe('Obtener appserver',() => {
    it('Devuelve status 200 Informacion del server', (done) => {
      chai.request(server).get('/api/servers/205').set('token', 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJyb2xlIjoidXNlciJ9.LSxbmkvdruuPEePOBfO6kdHISG_GTzt_EJK9B47Dhms')
      .end((err, res) => {
        res.should.have.status(200);
      done();
      })
    })
  });
});*/
/*
describe('AppserversDatabase', () => {
  describe('Intento actualizar server con ref incorrecto',() => {
    it('Devuelve status 409 Ref incorrecto', (done) => {
      let updateServerJson = {
        _ref:''
      }
      chai.request(server).put('/api/servers/4').set('token', 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJyb2xlIjoibWFuYWdlciJ9.W7xeouAp5bshEoVvTDOg9K8OmZcCra7vJzPjomZz1JI')
      .send(updateServerJson)
        .end((err, res) => {
          res.should.have.status(409);
      done();
      })
    })
  });
});*/

/*
describe('AppserversDatabase', () => {
  describe('Intento borrar server con id incorrecto',() => {
    it('Devuelve status 500 Error', (done) => {
      chai.request(server).delete('/api/servers/q').set('token', 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJyb2xlIjoibWFuYWdlciJ9.W7xeouAp5bshEoVvTDOg9K8OmZcCra7vJzPjomZz1JI')
      .end((err, res) => {
        res.should.have.status(500);
      done();
      })
    })
  });
});*/
