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
  describe('Intento eliminar un usuario sin estar loggeado', ()=> {
    it('Devuelve Unauthorized', (done) => {

      chai.request(server).delete('/users/1')
        .end((err, res) => {
          res.should.have.status(401);
          res.body.error.should.have.property("message",'Unauthorized');
        done();
        });
    })
  })
});

describe('App Users database', () => {
  describe('Intento eliminar un auto sin estar loggeado', ()=> {
    it('Devuelve Unauthorized', (done) => {

      chai.request(server).delete('/users/1/cars/3')
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

describe('App Users database', () => {
  describe('Obtengo informacion de un usuario en particular', ()=> {
    it('Devuelve Status 200 Informacion del usuario', (done) => {
      let appserverJson = {
        username: "GAGimenez",
        password: "1234"
        }
      var session = chai.request.agent(server);
      session.post('/login').send(appserverJson)
      .then( function(res){
        session.get('/users/3')
          .end((err, res) => {
            res.should.have.status(200);
          });
          done();
    })
  })
})});

describe('App Users database', () => {
  describe('Intento borrar un usuario de negocio inexistente', ()=> {
    it('Devuelve Status 404 No existe el recurso', (done) => {
      let appserverJson = {
        username: "GAGimenez",
        password: "1234"
        }
      var session = chai.request.agent(server);
      session.post('/login').send(appserverJson)
      .then( function(res){
        session.get('/users/1')
          .end((err, res) => {
            res.should.have.status(404);
          });
          done();
    })
  })
})});


describe('App Users database', () => {
  describe('Intento dar de alta un usuario', ()=> {
    it('Devuelve Status 201 Alta correcta', (done) => {
      let appserverJson = {
        username: "GAGimenez",
        password: "1234"
        }
        let userJson = {
          firstname : "Gabriel",
          lastname : "Mercado",
          email : "gabi@gmail.com",
          birthdate : "1/1/1986",
          type : "passenger",
          country : "Argentina",
          username : "Gabi",
          password : "1234"
        }
      var session = chai.request.agent(server);
      session.post('/login').send(appserverJson)
      .then( function(res){
        session.post('/users').send(userJson)
          .end((err, res) => {
            res.should.have.status(201);
          });
          done();
    })
  })
})});

describe('App Users database', () => {
  describe('Intento validar usuario sin enviar password', ()=> {
    it('Devuelve Status 400 Incumplimiento de precondiciones', (done) => {
      let appserverJson = {
        username: "GAGimenez",
        password: "1234"
        }
        let userJson = {
          firstname : "Gabriel",
          lastname : "Mercado",
          email : "gabi@gmail.com",
          birthdate : "1/1/1986",
          type : "passenger",
          country : "Argentina",
          username : "Gabi"
        }
      var session = chai.request.agent(server);
      session.post('/login').send(appserverJson)
      .then( function(res){
        session.post('/users/validate').send(userJson)
          .end((err, res) => {
            res.should.have.status(400);
          });
          done();
    })
  })
})});
