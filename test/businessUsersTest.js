var assert = require('chai').assert;
var server = require('../server');
var chai = require('chai');
var chaiHttp = require('chai-http');
var should = chai.should();


describe('BusinessUsersDatabase', () => {
  describe('Creo correctamente un usuario de negocio', ()=> {
    it('Devuelve Alta correcta', (done) => {
      let businessUserJson = {
        name: "Gustavo",
        username: "Gus",
        password: "1234",
        surname: "Gimenez",
        role: "Admin"
        }
      chai.request(server).post('/business-users').send(businessUserJson)
        .end((err, res) => {
          res.should.have.status(201);
          res.body.should.have.property("description", 'Alta correcta');
        done();
        });
    })
  })
});

describe('BusinessUsersDatabase', () => {
  describe('Creo usuario de negocio sin un parametro', ()=> {
    it('Devuelve error en precondiciones', (done) => {
      let businessUserJson = {
        name: "",
        username: "Gus",
        password: "1234",
        surname: "Gimenez",
        role: "Admin"
        }
      chai.request(server).post('/business-users').send(businessUserJson)
        .end((err, res) => {
          res.should.have.status(400);
          res.body.error.should.have.property("message", 'Incumplimiento de precondiciones');
        done();
        });
    })
  })
});


describe('BusinessUsersDatabase', () => {
  describe('Loggin correcto', ()=> {
    it('Devuelve inicio de sesion correcta', (done) => {
      let businessUserJson = {
        username: "Gus",
        password: "1234",
        }
      chai.request(server).post('/login').send(businessUserJson)
        .end((err, res) => {
          res.should.have.status(200);
          res.text.should.be.eql('Inicio de sesion correcta');
        done();
        });
    })
  })
});

describe('BusinessUsersDatabase', () => {
  describe('Intento obtener usuarios de negocio sin estar loggeado', ()=> {
    it('Devuelve Unauthorized', (done) => {

      chai.request(server).get('/business-users')
        .end((err, res) => {
          res.should.have.status(401);
          res.body.error.should.have.property("message",'Unauthorized');
        done();
        });
    })
  })
});


describe('BusinessUserDatabase', () => {
  describe('Obtengo todos los usuarios de negocio luego del login', ()=> {
    it('Devuelve Status 200', (done) => {
      let loginJson = {
        username: "GAGimenez",
        password: "1234"
        }
      var session = chai.request.agent(server);
      session.post('/login').send(loginJson)
      .then( function(res){
        session.get('/business-users')
          .end((err, res) => {
            res.should.have.status(200);
            //res.text.should.be.eql('Alta correcta');
          });
        done();
    })
  })
})});

describe('BusinessUsersDatabase', () => {
  describe('Intento obtener informacion personal sin estar loggeado', ()=> {
    it('Devuelve Unauthorized', (done) => {

      chai.request(server).get('/business-users/me')
        .end((err, res) => {
          res.should.have.status(401);
          res.body.error.should.have.property("message",'Unauthorized');
        done();
        });
    })
  })
});
