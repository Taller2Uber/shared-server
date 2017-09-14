var logger = require('winston');
const moment = require('moment')

var loggerLevels = {
    levels: {
      error: 0,
      warn: 1,
      info: 2,
      debug: 3
    },
    colors: {
      debug: 'blue',
      info: 'green',
      warn: 'yellow',
      error: 'red'
  }
};

logger.add(logger.transports.File, { filename: "./ServerLog.log",
    timestamp: function(){
      return moment().format('DD-MM-YYYY hh:mm:ss');
    },
    levels : loggerLevels.levels,
    level: 'info'
  }
);

logger.addColors(loggerLevels.colors);

module.exports=logger;
