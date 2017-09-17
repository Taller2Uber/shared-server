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
