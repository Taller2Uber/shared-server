const Logger = require('heroku-logger').Logger;

const herokuLogger = new Logger({
  level: 'info'
});

module.exports = herokuLogger;
