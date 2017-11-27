var assert = require('chai').assert;
var server = require('../server');
var chai = require('chai');
var chaiHttp = require('chai-http');
var should = chai.should();
var expect = chai.expect;

chai.use(chaiHttp);

describe('App Users database', () => {
  describe('Intento eliminar un usuario sin estar loggeado', ()=> {
    it('Devuelve Unauthorized', (done) => {

      chai.request(server).delete('/api/users/1')
        .end((err, res) => {
          res.should.have.status(401);
        done();
        });
    })
  })
});

describe('App Users database', () => {
  describe('Intento eliminar un auto sin estar loggeado', ()=> {
    it('Devuelve Unauthorized', (done) => {

      chai.request(server).delete('/api/users/1/cars/3')
        .end((err, res) => {
          res.should.have.status(401);
        done();
        });
    })
  })
});

describe('App Users database', () => {
  describe('Intento obtener informacion de un usuario sin estar loggeado', ()=> {
    it('Devuelve Unauthorized', (done) => {

      chai.request(server).get('/api/users/3')
        .end((err, res) => {
          res.should.have.status(401);
        done();
        });
    })
  })
});


describe('App Users database', () => {
  describe('Obtengo todos los appusers luego del login', ()=> {
    it('Devuelve Status 200', (done) => {
      chai.request(server).get('/api/users').set('token', 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJyb2xlIjoiYWRtaW4ifQ.dj_-4mL3GH79wZpvWBRtgyB8yPD_bi9wMy29b4IdYmU')
      .end((err, res) => {
        res.should.have.status(200);
      });
      done();
    })
  })
});


describe('App Users database', () => {
  describe('Obtengo informacion de un usuario en particular', ()=> {
    it('Devuelve Status 200 Informacion del usuario', (done) => {
        chai.request(server).get('/api/users/48').set('token', 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJyb2xlIjoidXNlciJ9.LSxbmkvdruuPEePOBfO6kdHISG_GTzt_EJK9B47Dhms')
        .end((err, res) => {
          expect(res).to.have.status(200);
          done();
          });
    })
  })
});


describe('App Users database', () => {
  describe('Intento borrar un usuario inexistente', ()=> {
    it('Devuelve Status 404 No existe el recurso', (done) => {
      let appserverJson = {
        username: "GAGimenez",
        password: "1234"
        }
        chai.request(server).delete('/api/users/1').set('token', 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJyb2xlIjoibWFuYWdlciJ9.W7xeouAp5bshEoVvTDOg9K8OmZcCra7vJzPjomZz1JI')
        .end((err, res) => {
            res.should.have.status(404);
            done();
        });
    })
  })
});


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
        chai.request(server).post('/api/users').set('token', 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJyb2xlIjoibWFuYWdlciJ9.W7xeouAp5bshEoVvTDOg9K8OmZcCra7vJzPjomZz1JI')
        .send(userJson)
        .end((err, res) => {
            res.should.have.status(201);
          });
          done();
    })
  })
});


describe('App Users database', () => {
  describe('Intento actualizar usuario con parametros faltantes', ()=> {
    it('Devuelve Status 400 Incumplimiento de precondiciones', (done) => {
        let userJson = {
          lastname : "Mercado",
          email : "gabi@gmail.com",
          birthdate : "1/1/1986",
          type : "passenger",
          username : "Gabi",
          password : "1234"
        }
        chai.request(server).put('/api/users/3')
        .send(userJson).set('token', '897fdabec119c3ab5cd0d892a32cdeb1CK6pyw8mdTOMxYVptFVVPuBnJD8uvyVnAzylUBD6m5wq63FFnoyigSZPnN1+dByOVoXdNioGXRtSQwV6i9I+Unjb1+Ib3hBh3MYNDd/KSajQFmv7d6Nfq3xh56eO+mRz82JPPgySa1gl/TpWo+byRjyaSGVgidunGiAIim5lirVkReJyXfxwUxDh/9OCSgyobcKfYUX5fVHrEHnEdcZrAA==')
          .end((err, res) => {
            expect(res).to.have.status(400);
            done();
          });
        })
      })
});

describe('App Users database', () => {
  describe('Intento actualizar usuario con ref incorrecto', ()=> {
    it('Devuelve Status 409 Conflicto con el ref', (done) => {
        let userJson = {
          country: "Argentina",
          firstname : "gabi",
          lastname : "Mercado",
          email : "gabi@gmail.com",
          birthdate : "1/1/1986",
          type : "passenger",
          username : "Gabi",
          password : "1234",
          _ref: "a",
          fb : {
            userid: ""
          }
        }
        chai.request(server).put('/api/users/71')
        .send(userJson).set('token', '897fdabec119c3ab5cd0d892a32cdeb1CK6pyw8mdTOMxYVptFVVPuBnJD8uvyVnAzylUBD6m5wq63FFnoyigSZPnN1+dByOVoXdNioGXRtSQwV6i9I+Unjb1+Ib3hBh3MYNDd/KSajQFmv7d6Nfq3xh56eO+mRz82JPPgySa1gl/TpWo+byRjyaSGVgidunGiAIim5lirVkReJyXfxwUxDh/9OCSgyobcKfYUX5fVHrEHnEdcZrAA==')
          .end((err, res) => {
            expect(res).to.have.status(409);
            done();
          });
        })
      })
});



describe('App Users database', () => {
  describe('Intento validar usuario sin enviar password', ()=> {
    it('Devuelve Status 400 Incumplimiento de precondiciones', (done) => {
        let userJson = {
          username : "Gabi"
        }
        chai.request(server).post('/api/users/validate')
        .send(userJson).set('token', '897fdabec119c3ab5cd0d892a32cdeb1CK6pyw8mdTOMxYVptFVVPuBnJD8uvyVnAzylUBD6m5wq63FFnoyigSZPnN1+dByOVoXdNioGXRtSQwV6i9I+Unjb1+Ib3hBh3MYNDd/KSajQFmv7d6Nfq3xh56eO+mRz82JPPgySa1gl/TpWo+byRjyaSGVgidunGiAIim5lirVkReJyXfxwUxDh/9OCSgyobcKfYUX5fVHrEHnEdcZrAA==')
          .end((err, res) => {
            expect(res).to.have.status(400);
            done();
          });
    })
  })
});

describe('App Users database', () => {
  describe('Intento validar usuario con credenciales correctas', ()=> {
    it('Devuelve Status 200 Incumplimiento de precondiciones', (done) => {
        let userJson = {
          username : "Gabi",
          password: "1234"
        }
        chai.request(server).post('/api/users/validate')
        .send(userJson).set('token', '897fdabec119c3ab5cd0d892a32cdeb1CK6pyw8mdTOMxYVptFVVPuBnJD8uvyVnAzylUBD6m5wq63FFnoyigSZPnN1+dByOVoXdNioGXRtSQwV6i9I+Unjb1+Ib3hBh3MYNDd/KSajQFmv7d6Nfq3xh56eO+mRz82JPPgySa1gl/TpWo+byRjyaSGVgidunGiAIim5lirVkReJyXfxwUxDh/9OCSgyobcKfYUX5fVHrEHnEdcZrAA==')
          .end((err, res) => {
            expect(res).to.have.status(200);
            done();
          });
    })
  })
});

describe('App Users database', () => {
  describe('Intento validar usuario con fbToken invalido', ()=> {
    it('Devuelve Status 401, credenciales incorrectas', (done) => {
        let userJson = {
          facebookAuthToken : "a"
        }
        chai.request(server).post('/api/users/validate')
        .send(userJson).set('token', '897fdabec119c3ab5cd0d892a32cdeb1CK6pyw8mdTOMxYVptFVVPuBnJD8uvyVnAzylUBD6m5wq63FFnoyigSZPnN1+dByOVoXdNioGXRtSQwV6i9I+Unjb1+Ib3hBh3MYNDd/KSajQFmv7d6Nfq3xh56eO+mRz82JPPgySa1gl/TpWo+byRjyaSGVgidunGiAIim5lirVkReJyXfxwUxDh/9OCSgyobcKfYUX5fVHrEHnEdcZrAA==')
          .end((err, res) => {
            expect(res).to.have.status(401);
            done();
          });
    })
  })
});

/*
describe('App Users database', () => {
  describe('Intento validar usuario con fbToken valido pero que no pertenece a la aplicacion', ()=> {
    it('Devuelve Status 200, Token correcto pero usuario inexistente', (done) => {
        let userJson = {
          facebookAuthToken : "EAACJBqyemYEBAP3jPoFrcPYnF9YH1Ney81O0NNDmQtU6UdHCuVwAKQZAPLH4KBapN8vFznxMKB7TIv8MYNufJV8AV2NTib8uiUWxBliCRtYVuM8qSGZCJmZA16EbXChvXuWo17UigRZAgqdDfpC1wIwg4BSK6hgtry3bMllVEcSWhSdIpWvZCnNTfd4qSJO7vBJ9mDyOmZAVsZA6uWEBtU2JHesZBGcRbpJPaHtTEcSVQwZDZD"
        }
        chai.request(server).post('/api/users/validate')
        .send(userJson).set('token', '897fdabec119c3ab5cd0d892a32cdeb1CK6pyw8mdTOMxYVptFVVPuBnJD8uvyVnAzylUBD6m5wq63FFnoyigSZPnN1+dByOVoXdNioGXRtSQwV6i9I+Unjb1+Ib3hBh3MYNDd/KSajQFmv7d6Nfq3xh56eO+mRz82JPPgySa1gl/TpWo+byRjyaSGVgidunGiAIim5lirVkReJyXfxwUxDh/9OCSgyobcKfYUX5fVHrEHnEdcZrAA==')
          .end((err, res) => {
            expect(res).to.have.status(200);
            done();
          });
    })
  })
});*/

describe('App Users database', () => {
  describe('Intento dar de alta usuario ', ()=> {
    it('Devuelve Status 201, Alta correcta', (done) => {
        let userJson = {
          username: "userTest",
          password: "passTest",
          type: "driver",
          firstname: "nameTest",
          lastname: "lastNameTest",
          country: "argentina",
          email: "mail@mail.com",
          birthdate: "12/12/1912",
          fb:{
            userid:""
          }
        }
        chai.request(server).post('/api/users/')
        .send(userJson).set('token', '897fdabec119c3ab5cd0d892a32cdeb1CK6pyw8mdTOMxYVptFVVPuBnJD8uvyVnAzylUBD6m5wq63FFnoyigSZPnN1+dByOVoXdNioGXRtSQwV6i9I+Unjb1+Ib3hBh3MYNDd/KSajQFmv7d6Nfq3xh56eO+mRz82JPPgySa1gl/TpWo+byRjyaSGVgidunGiAIim5lirVkReJyXfxwUxDh/9OCSgyobcKfYUX5fVHrEHnEdcZrAA==')
          .end((err, res) => {
            expect(res).to.have.status(201);
            done();
          });
    })
  })
});
