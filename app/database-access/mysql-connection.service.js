import ConfigService from '../config/config.service';
const mysql = require('promise-mysql');
let connectionPool = undefined;
let MysqlConnectionService = {
  getPool: (database) => {
    if (connectionPool !== undefined) {
      return connectionPool;
    }
    console.log('calling connection pool');
    if ((database = 'afyastat')) {
      connectionPool = mysql.createPool(ConfigService.getConfig().afyastat);
    } else {
      connectionPool = mysql.createPool(ConfigService.getConfig().mysql);
    }

    return connectionPool;
  }
};

Object.freeze(MysqlConnectionService);
export default MysqlConnectionService;
