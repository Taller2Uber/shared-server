var assert = require('chai').assert;
var pgdb = require('../app/config/pgdb');


describe('Test de prueba', function() {
  describe('Suma de dos numeros', function() {
    it('Debe devolver la suma de dos numeros', function() {
      assert.equal(3, pgdb.testFunction(1,2));
    });
  });
});
