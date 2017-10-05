var assert = require('chai').assert;
var server = require('../server');
var chai = require('chai');
var chaiHttp = require('chai-http');
var should = chai.should();

chai.use(chaiHttp);


describe('App Users database', () => {
  describe('Intento obtener usuarios sin estar loggeado', ()=> {
    it('Devuelve Unauthorized', (done) => {

      chai.request(server).get('/users')
        .end((err, res) => {
          res.should.have.status(401);
          res.body.error.should.have.property("message",'Unauthorized');
        done();
        });
    })
  })
});

describe('App Users database', () => {
  describe('Intento obtener informacion de un usuario sin estar loggeado', ()=> {
    it('Devuelve Unauthorized', (done) => {

      chai.request(server).get('/users/3')
        .end((err, res) => {
          res.should.have.status(401);
          res.body.error.should.have.property("message",'Unauthorized');
        done();
        });
    })
  })
});


describe('App Users database', () => {
  describe('Obtengo todos los appusers luego del login', ()=> {
    it('Devuelve Status 200', (done) => {
      let appserverJson = {
        username: "GAGimenez",
        password: "1234"
        }
      var session = chai.request.agent(server);
      session.post('/login').send(appserverJson)
      .then( function(res){
        session.get('/users')
          .end((err, res) => {
            res.should.have.status(200);
          });
          done();
    })
  })
})});
