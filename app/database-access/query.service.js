import MysqlConnectionService from './mysql-connection.service';
export default class QueryService {
  constructor() {}
  executeQuery(sqlString, params) {
    if (params === 'afyastat') {
      const database = 'afyastat';
      return MysqlConnectionService.getPool(database).query(sqlString, params);
    } else {
      return MysqlConnectionService.getPool().query(sqlString, params);
    }
  }
}
