var assert = require('chai').assert;
var server = require('../server');
var chai = require('chai');
var chaiHttp = require('chai-http');
var should = chai.should();
var expect = chai.expect;


describe('BusinessUsersDatabase', () => {
  describe('Creo correctamente un usuario de negocio', ()=> {
    it('Devuelve Alta correcta', function(done){
      let businessUserJson = {
        name: "Gustavo",
        username: "Gus",
        password: "1234",
        surname: "Gimenez",
        role: "Admin"
        }
      chai.request(server).post('/api/business-users').set('token', 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJyb2xlIjoiYWRtaW4ifQ.dj_-4mL3GH79wZpvWBRtgyB8yPD_bi9wMy29b4IdYmU')
      .send(businessUserJson).end((err, res) => {
          expect(res).to.have.status(201);
          done()
        });
    })
  })
});


describe('BusinessUsersDatabase', () => {
  describe('Creo usuario de negocio sin un parametro', ()=> {
    it('Devuelve error en precondiciones', function(done){
      let businessUserJson = {
        name: "",
        username: "Gus",
        password: "1234",
        surname: "Gimenez",
        role: "Admin"
        }
      chai.request(server).post('/api/business-users').set('token', 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJyb2xlIjoiYWRtaW4ifQ.dj_-4mL3GH79wZpvWBRtgyB8yPD_bi9wMy29b4IdYmU')
      .send(businessUserJson)
        .end((err, res) => {
          expect(res).to.have.status(400);
          done()
        });
    })
  })
});

describe('BusinessUsersDatabase', () => {
  describe('Loggin incorrecto (sin password)', ()=> {
    it('Devuelve status 400 Informacion faltante', function(done){
      let businessUserJson = {
        username: "Gus"
        }
      chai.request(server).post('/api/token').send(businessUserJson)
        .end((err, res) => {
          expect(res).to.have.status(400);
          done()
        });
    })
  })
});


describe('BusinessUsersDatabase', () => {
  describe('Loggin  com password incorrecto', ()=> {
    it('Devuelve status 401 Unauthorized', function(done){
      let businessUserJson = {
        username: "Gus",
        password: "12"
        }
      chai.request(server).post('/api/token').send(businessUserJson)
        .end((err, res) => {
          expect(res).to.have.status(401);
          done()
        });
    })
  })
});


describe('BusinessUsersDatabase', () => {
  describe('Intento obtener usuarios de negocio sin estar loggeado', ()=> {
    it('Devuelve Unauthorized', function(done){
      chai.request(server).get('/api/business-users')
        .end((err, res) => {
          expect(res).to.have.status(401);
          done()
        });
    })
  })
});


describe('BusinessUsersDatabase', () => {
  describe('Intento actualizar un usuario de negocio sin estar loggeado', ()=> {
    it('Devuelve Unauthorized', function(done){

      chai.request(server).put('/api/business-users/3')
        .end((err, res) => {
          expect(res).to.have.status(401);
          done()
        });
    })
  })
});


describe('BusinessUsersDatabase', () => {
  describe('Intento obtener un usuario de negocio sin estar loggeado', ()=> {
    it('Devuelve Unauthorized', function(done){
      chai.request(server).get('/api/business-users/2')
        .end((err, res) => {
          expect(res).to.have.status(401);
          done()
        });
    })
  })
});

describe('BusinessUsersDatabase', () => {
  describe('Intento borrar un usuario de negocio sin estar loggeado', ()=> {
    it('Devuelve Unauthorized', function(done){
      chai.request(server).delete('/api/business-users/2')
        .end((err, res) => {
          expect(res).to.have.status(401);
          done()
        });
    })
  })
});



describe('BusinessUserDatabase', () => {
  describe('Obtengo todos los usuarios de negocio luego del login', ()=> {
    it('Devuelve Status 200', function(done){
      let loginJson = {
        username: "GAGimenez",
        password: "1234"
        }
      chai.request(server).get('/api/business-users').set('token', 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJyb2xlIjoiYWRtaW4ifQ.dj_-4mL3GH79wZpvWBRtgyB8yPD_bi9wMy29b4IdYmU')
          .end((err, res) => {
            expect(res).to.have.status(200);
            done()
          });
    })
  })
});


describe('BusinessUserDatabase', () => {
  describe('Obtengo un usuario de negocio luego del login', ()=> {
    it('Devuelve Status 200', function(done){
      let loginJson = {
        username: "GAGimenez",
        password: "1234"
        }
      chai.request(server).get('/api/business-users/4').set('token', 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJyb2xlIjoidXNlciJ9.LSxbmkvdruuPEePOBfO6kdHISG_GTzt_EJK9B47Dhms')
      .end((err, res) => {
            expect(res).to.have.status(200);
            done()
          });
    })
  })
});

describe('BusinessUserDatabase', () => {
  describe('Intento obtener un usuario de negocio luego del login enviando id incorrecto', ()=> {
    it('Devuelve Status 500 Error', function(done){
      let loginJson = {
        username: "GAGimenez",
        password: "1234"
        }
      chai.request(server).get('/api/business-users/q').set('token', 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJyb2xlIjoidXNlciJ9.LSxbmkvdruuPEePOBfO6kdHISG_GTzt_EJK9B47Dhms')
      .end((err, res) => {
            expect(res).to.have.status(500);
            done()
          });
    })
  })
});

/*
describe('BusinessUserDatabase', () => {
  describe('Obtengo informacion personal luego del login', ()=> {
    it('Devuelve Status 200', function(done){
      chai.request(server).get('/business-users/me').set('token', 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJyb2xlIjoyNDd9.XxU-pxF_gcx0XEdvuPYJQniZtbu9dlyNGlQO7hC92-8')
      .end((err, results) => {
            results.should.have.status(200);
            done();
          });
    })
  })
});
*/


describe('BusinessUsersDatabase', () => {
  describe('Intento obtener informacion personal sin estar loggeado', ()=> {
    it('Devuelve Unauthorized', function(done){
      chai.request(server).get('/api/business-users/me')
        .end((err, res) => {
          expect(res).to.have.status(401);
          done()
        });
    })
  })
});



describe('BusinessUserDatabase', () => {
  describe('Intento actualizar un usuario de negocio enviando id incorrecto', ()=> {
    it('Devuelve Status 500 Internal error', function(done){
      let loginJson = {
        username: "GAGimenez",
        password: "1234",
        name: 'gustavo',
        surname: 'gus',
        role: 'admin'
        }
      chai.request(server).put('/api/business-users/q').set('token', 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJyb2xlIjoiYWRtaW4ifQ.dj_-4mL3GH79wZpvWBRtgyB8yPD_bi9wMy29b4IdYmU')
      .send().end((err, res) => {
            expect(res).to.have.status(400);
            done()
          });
    })
  })
});

describe('BusinessUserDatabase', () => {
  describe('Intento actualizar un usuario de negocio enviando ref incorrecto', ()=> {
    it('Devuelve Status 409 ref incorrecto', function(done){
      let loginJson = {
        username: "GAGimenez",
        password: "1234",
        name: 'gustavo',
        surname: 'gus',
        role: 'admin',
        _ref: "a"
        }
      chai.request(server).put('/api/business-users/250').set('token', 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJyb2xlIjoiYWRtaW4ifQ.dj_-4mL3GH79wZpvWBRtgyB8yPD_bi9wMy29b4IdYmU')
      .send(loginJson).end((err, res) => {
            expect(res).to.have.status(409);
            done()
          });
    })
  })
});


describe('BusinessUserDatabase', () => {
  describe('Intento borrar un usuario de negocio enviando id incorrecto', ()=> {
    it('Devuelve Status 404 recurso solicitado no existente', function(done){
      chai.request(server).delete('/api/business-users/q').set('token', 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJyb2xlIjoiYWRtaW4ifQ.dj_-4mL3GH79wZpvWBRtgyB8yPD_bi9wMy29b4IdYmU')
      .end((err, res) => {
            expect(res).to.have.status(404);
            done()
          });
    })
  })
});
