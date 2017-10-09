var assert = require('chai').assert;
var server = require('../server');
var chai = require('chai');
var chaiHttp = require('chai-http');
var should = chai.should();

chai.use(chaiHttp);


describe('CarsDatabase', () => {
  describe('Intento obtener autos sin estar loggeado', ()=> {
    it('Devuelve status 401 Unauthorized', (done) => {

      chai.request(server).get('/users/3/cars')
        .end((err, res) => {
          res.should.have.status(401);
        done();
        });
    })
  })
});


describe('CarsDatabase', () => {
  describe('Creo correctamente un auto', ()=> {
    it('Devuelve Status 201', (done) => {
      let loginJson = {
        username: "GAGimenez",
        password: "1234"
        }
      let carJson = {
        owner: 3,
        properties: [{name:"color", value:"rojo"}]
      };
        chai.request(server).post('/users/3/cars').send(carJson)
          .end((err, res) => {
            res.should.have.status(201);
          });
        done();
  })
})});


describe('CarsDatabase', () => {
  describe('Intento obtener un auto inexistente', ()=> {
    it('Devuelve Auto inexistente 404', (done) => {
      let loginJson = {
        username: "GAGimenez",
        password: "1234"
        }
      var session = chai.request.agent(server);
      session.post('/login').send(loginJson)
      .then( function(res){
        session.get('/users/3/cars/2')
          .end((err, res) => {
            res.should.have.status(404);
          });
        done();
    })
  })
})});

describe('CarsDatabase', () => {
  describe('Intento obtener informacion de un auto en particular', ()=> {
    it('Devuelve status 200 Informacion del auto', (done) => {
      let loginJson = {
        username: "GAGimenez",
        password: "1234"
        }
      var session = chai.request.agent(server);
      session.post('/login').send(loginJson)
      .then( function(res){
        session.get('/users/3/cars/3')
          .end((err, res) => {
            res.should.have.status(200);
          });
        done();
    })
  })
})});


describe('CarsDatabase', () => {
  describe('Intento obtener todos los autos de un usuario', ()=> {
    it('Devuelve 201', (done) => {
      let loginJson = {
        username: "GAGimenez",
        password: "1234"
        }
      var session = chai.request.agent(server);
      session.post('/login').send(loginJson)
      .then( function(res){
        session.get('/users/3/cars')
          .end((err, res) => {
            res.should.have.status(201);
          });
        done();
    })
  })
})});
