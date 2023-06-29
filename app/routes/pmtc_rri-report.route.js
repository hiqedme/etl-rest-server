var authorizer = require('../../authorization/etl-authorizer');
import { PMTCTRRIReportingService } from './../../service/rri/pmtct_rri_reporting.service.js';
var etlHelpers = require('../../etl-helpers');
var privileges = authorizer.getAllPrivileges();
var preRequest = require('../../pre-request-processing');
const routes = [
  {
    method: 'GET',
    path: '/etl/pmtct_rri_summary',
    config: {
      plugins: {
        hapiAuthorization: {
          role: privileges.canViewClinicDashBoard
        }
      },
      handler: function (request, reply) {
        preRequest.resolveLocationIdsToLocationUuids(request, function () {
          let requestParams = Object.assign({}, request.query, request.params);
          let reportParams = etlHelpers.getReportParams(
            'pmtct_rri_summary',
            ['endDate', 'locationUuids'],
            requestParams
          );

          console.log(
            'reportParams.requestParams ',
            reportParams.requestParams
          );

          let service = new PMTCTRRIReportingService(
            'pmtctRriSummary',
            reportParams.requestParams
          );
          service
            .getPmtctRriSummaryReport(reportParams.requestParams)
            .then((result) => {
              reply(result);
            })
            .catch((error) => {
              reply(error);
            });
        });
      },
      description: 'PMTCT, HEI, CALHIV and WRA RRI reports',
      notes: 'PMTCT, HEI, CALHIV and WRA RRI reports',
      tags: ['api'],
      validate: {
        options: {
          allowUnknown: true
        },
        params: {}
      }
    }
  }
];
exports.routes = (server) => server.route(routes);
