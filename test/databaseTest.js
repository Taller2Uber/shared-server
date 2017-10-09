var assert = require('chai').assert;
var server = require('../server');
var chai = require('chai');
var chaiHttp = require('chai-http');
var should = chai.should();

chai.use(chaiHttp);

describe('AppserversDatabase', () => {
  describe('Creo correctamente un appserver', ()=> {
    it('Devuelve Alta correcta', (done) => {
      let appserverJson = {
        name: "Gustavo"
        }
      chai.request(server).post('/servers').send(appserverJson)
        .end((err, res) => {
          res.should.have.status(201);
          res.text.should.be.eql('Alta correcta');
        done();
        });
    })
  })
});

describe('AppserversDatabase', () => {
  describe('Intento crear appserver sin nombre',() => {
    it('Devuelve parametros faltantes...', (done) => {
      let appserverJson = {
        name: ''
      }
      chai.request(server).post('/servers').send(appserverJson)
      .end((err, res) => {
        res.should.have.status(400);
        res.text.should.be.eql('Incumplimiento de precondiciones (parámetros faltantes)');
      done();
      })
    })
  });
});


describe('AppserversDatabase', () => {
  describe('Obtener todos los appservers',() => {
    it('Devuelve Ok', (done) => {
      chai.request(server).get('/servers')
      .end((err, res) => {
        res.should.have.status(200);
      done();
      })
    })
  });
});


describe('AppserversDatabase', () => {
  describe('Obtener appserver inexistente',() => {
    it('Devuelve status 404 server inexistente', (done) => {
      chai.request(server).get('/servers/1')
      .end((err, res) => {
        res.should.have.status(404);
      done();
      })
    })
  });
});

describe('AppserversDatabase', () => {
  describe('Obtener appserver',() => {
    it('Devuelve status 200 Informacion del server', (done) => {
      chai.request(server).get('/servers/26')
      .end((err, res) => {
        res.should.have.status(200);
      done();
      })
    })
  });
});

describe('AppserversDatabase', () => {
  describe('Intento actualizar server con ref incorrecto',() => {
    it('Devuelve status 409 Ref incorrecto', (done) => {
      let updateServerJson = {
        _ref:''
      }
      chai.request(server).put('/servers/26').send(updateServerJson)
      .end((err, res) => {
        res.should.have.status(409);
      done();
      })
    })
  });
});

describe('AppserversDatabase', () => {
  describe('Intento renovar token con ref incorrecto',() => {
    it('Devuelve status 409 Ref incorrecto', (done) => {
      let updateServerJson = {
        _ref:''
      }
      chai.request(server).post('/servers/26').send(updateServerJson)
      .end((err, res) => {
        res.should.have.status(409);
      done();
      })
    })
  });
});
