var assert = require('chai').assert;
var server = require('../server');
var chai = require('chai');
var chaiHttp = require('chai-http');
var should = chai.should();

chai.use(chaiHttp);


describe('Database', () => {
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

describe('Database', () => {
  describe('Intento crear appserver sin nombre',() => {
    it('Devuelve parametros faltantes...', (done) => {
      let appserverJson = {
        name: ''
      }
      chai.request(server).post('/servers').send(appserverJson)
      .end((err, res) => {
        res.should.have.status(400);
        res.text.should.be.eql('Incumplimiento de precondiciones (parámetros faltantes)');
      done()
      })
    })
  });
});

describe('Database', () => {
  describe('Obtener todos los appservers',() => {
    it('Devuelve un array de Json', (done) => {
      chai.request(server).get('/servers')
      .end((err, res) => {
        res.should.have.status(200);
        res.should.be.json;
        res.body.should.be.a('array');
      done()
      })
    })
  });
});
