import { HTSReportDAO } from './hts-report-dao';

export class HTSReportService {
  constructor() {}

  getHTSReport() {
    let dao = this.getDaoClass();
    return new Promise((resolve, reject) => {
      return dao
        .getHTSReport()
        .then((results) => {
          resolve({
            results: results
          });
        })
        .catch((error) => {
          reject(error);
        });
    });
  }

  getDaoClass() {
    return new HTSReportDAO();
  }
}
