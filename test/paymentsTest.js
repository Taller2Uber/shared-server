var assert = require('chai').assert;
var server = require('../server');
var chai = require('chai');
var expect = chai.expect
var chaiHttp = require('chai-http');
var should = chai.should();

chai.use(chaiHttp);

describe('paymentsTest', () => {
  describe('Intento obtener metodos de pago', ()=> {
    it('Devuelve status 200', function(done){
      chai.request(server)
      .get('/api/paymethods').set('token', 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJyb2xlIjoidXNlciJ9.LSxbmkvdruuPEePOBfO6kdHISG_GTzt_EJK9B47Dhms')
      .end(function(err, res){
        expect(res).to.have.status(200);
        done()
      })
    })
  })
});
