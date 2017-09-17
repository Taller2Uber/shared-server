var assert = require('chai').assert;
var server = require('../server');
var chai = require('chai');
var chaiHttp = require('chai-http');
var should = chai.should();

chai.use(chaiHttp);


describe('Routes', () => {
  describe('Intento acceder a una ruta no existente', ()=> {
    it('Devuelve pagina no existente', (done) => {
      chai.request(server).get('/cualquierPagina')
        .end((err, res) => {
          res.should.have.status(404);
          res.text.should.be.eql('La pagina solicitada no existe');
        done();
        });
    })
  })
});
