const Logger = require('heroku-logger').Logger;

const herokuLogger = new Logger({
  level: 'error'
});

module.exports = herokuLogger;
