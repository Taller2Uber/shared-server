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
      var session = chai.request.agent(server);
      session.post('/login').send(loginJson)
      .then( function(res){
        session.post('/users/3/cars').send(carJson)
          .end((err, res) => {
            res.should.have.status(201);
          });
        done();
    })
  })
})});