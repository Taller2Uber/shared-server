var assert = require('chai').assert;
var server = require('../server');
var chai = require('chai');
var chaiHttp = require('chai-http');
var should = chai.should();

chai.use(chaiHttp);


describe('CarsDatabase', () => {
  describe('Intento obtener autos sin estar loggeado', ()=> {
    it('Devuelve status 401 Unauthorized', function(done){

      chai.request(server).get('/api/users/3/cars')
        .end((err, res) => {
          res.should.have.status(401);
        done();
        });
    })
  })
});

describe('CarsDatabase', () => {
  describe('Creo correctamente un auto', ()=> {
    it('Devuelve Status 201', function(done){
      let carJson = {
        owner: 3,
        properties: [{name:"color", value:"rojo"}]
      };
        chai.request(server).post('/api/users/74/cars').set('token', 'c65fc146b6fdaf297f1ac4aa0ebca72cxU0gezu4NkaeE+KZLm5tDCNpp+jiW0OD+UPuX6A2rGE=')
        .send(carJson)
          .end((err, res) => {
            res.should.have.status(201);
          });
        done();
  })
})});


describe('CarsDatabase', () => {
  describe('Intento obtener un auto inexistente', ()=> {
    it('Devuelve Auto inexistente 404', function(done){
      let loginJson = {
        username: "GAGimenez",
        password: "1234"
        }
      chai.request(server).get('/api/users/72/cars').set('token', 'c65fc146b6fdaf297f1ac4aa0ebca72cxU0gezu4NkaeE+KZLm5tDCNpp+jiW0OD+UPuX6A2rGE=')
      .end((err, res) => {
            res.should.have.status(404);
          });
        done();
    })
  })
});


describe('CarsDatabase', () => {
  describe('Intento obtener un auto de un usuario inexistente', ()=> {
    it('Devuelve 404 recurso solicitado no existe', function(done){
      let loginJson = {
        username: "GAGimenez",
        password: "1234"
        }
      chai.request(server).get('/api/users/1/cars/2').set('token', 'c65fc146b6fdaf297f1ac4aa0ebca72cxU0gezu4NkaeE+KZLm5tDCNpp+jiW0OD+UPuX6A2rGE=')
      .end((err, res) => {
            res.should.have.status(404);
          });
        done();
    })
  })
});

describe('CarsDatabase', () => {
  describe('Intento obtener informacion de un auto en particular', ()=> {
    it('Devuelve status 200 Informacion del auto', function(done){
      chai.request(server).get('/api/users/72/cars').set('token', 'c65fc146b6fdaf297f1ac4aa0ebca72cxU0gezu4NkaeE+KZLm5tDCNpp+jiW0OD+UPuX6A2rGE=')
      .end((err, res) => {
            res.should.have.status(200);
          });
        done();
    })
  })
});


describe('CarsDatabase', () => {
  describe('Intento obtener todos los autos de un usuario', ()=> {
    it('Devuelve 201', function(done){
      chai.request(server).get('/api/users/72/cars').set('token', '897fdabec119c3ab5cd0d892a32cdeb1CK6pyw8mdTOMxYVptFVVPuBnJD8uvyVnAzylUBD6m5wq63FFnoyigSZPnN1+dByOVoXdNioGXRtSQwV6i9I+Unjb1+Ib3hBh3MYNDd/KSajQFmv7d6Nfq3xh56eO+mRz82JPPgySa1gl/TpWo+byRjyaSGVgidunGiAIim5lirVkReJyXfxwUxDh/9OCSgyobcKfYUX5fVHrEHnEdcZrAA==')
      .end((err, res) => {
            res.should.have.status(201);
          });
        done();
    })
  })
});
