var assert = require('chai').assert;
var server = require('../server');
var chai = require('chai');
var expect = chai.expect
var chaiHttp = require('chai-http');
var should = chai.should();

chai.use(chaiHttp);

describe('TripsDatabase', () => {
  describe('Intento obtener cotizacion de viaje', ()=> {
    it('Devuelve status 200 Costo del viaje', function(done){
      var trip = {
        "driver": 71,
        "passenger": 48,
        "start": {
          "address": {
            "street": "Av Santa Fe 3889",
            "location": {
              "lat": -34.612920,
              "lon": -58.379063
            }
          },
          "timestamp": 0
        },
        "end": {
          "address": {
            "street": "Av Cabildo 229",
            "location": {
              "lat": -34.572748,
              "lon": -58.433396
            }
          },
          "timestamp": 0
        },
        "totalTime": 0,
        "waitTime": 0,
        "travelTime": 0,
        "distance": 0,
        "route": [
          {
            "location": {
              "lat": 0,
              "lon": 0
            },
            "timestamp": 0
          }
        ],
        "cost": {
          "currency": "ARS",
          "value": 20
        },
      "paymethod": {
        "paymethod": "string",
        "parameters": {}
        }
      }
      chai.request(server).post('/api/trips/estimate')
      .send(trip).set('token', '897fdabec119c3ab5cd0d892a32cdeb1CK6pyw8mdTOMxYVptFVVPuBnJD8uvyVnAzylUBD6m5wq63FFnoyigSZPnN1+dByOVoXdNioGXRtSQwV6i9I+Unjb1+Ib3hBh3MYNDd/KSajQFmv7d6Nfq3xh56eO+mRz82JPPgySa1gl/TpWo+byRjyaSGVgidunGiAIim5lirVkReJyXfxwUxDh/9OCSgyobcKfYUX5fVHrEHnEdcZrAA==')
      .end(function(err, res){
        expect(res).to.have.status(200);
        done()
      })
    })
  })
});
