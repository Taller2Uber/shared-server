var logger = require('winston');
const moment = require('moment')

logger.add(logger.transports.File, { filename: "./ServerLog.log",
    timestamp: function(){
      return moment().format('DD-MM-YYYY hh:mm:ss');
    }
  }
);

module.exports=logger;
