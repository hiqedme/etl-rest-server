const db = require('../../etl-db');

/**
 * Gets the predicted score for a patient from the database.
 *
 * @param {string} patientUuid - The UUID of the patient
 * @returns {Promise<Object>} A promise that resolves with the result
 */
const getPredictedScore = async (patientUuid) => {
  return new Promise((resolve, reject) => {
    const sql = `SELECT 
    ml.person_id,
    ml.encounter_id,
    ml.location_id,
    ml.rtc_date,
    CASE
        WHEN
            mlfm.prediction_endpoint = 7
                AND ml.week > '2024-W36'
        THEN
            ml.predicted_risk_7day
        ELSE ml.predicted_risk
    END AS predicted_risk,
    CASE
        WHEN
            mlfm.prediction_endpoint = 7
                AND ml.week > '2024-W36'
        THEN
            ml.predicted_prob_disengage_7day
        ELSE ml.predicted_prob_disengage
    END AS predicted_prob_disengage,
    ml.observed_rtc_date,
    ml.prediction_generated_date,
    ml.model_version,
    ml.start_date,
    ml.end_date,
    ml.week
FROM
    predictions.ml_weekly_predictions ml
        LEFT JOIN
    amrs.person p ON (ml.person_id = p.person_id)
        LEFT JOIN
    predictions.ml_facility_metadata mlfm ON (mlfm.location_id = ml.location_id)
WHERE
    p.uuid = '${patientUuid}' 
        AND p.voided = 0
ORDER BY ml.prediction_generated_date DESC
LIMIT 1;`;

    const queryParts = {
      sql: sql
    };

    db.queryServer(queryParts, (result) => {
      result.sql = sql;
      resolve(result);
    });
  });
};

/**
 * Gets the predicted score data for a patient.
 *
 * @param {string} patientUuid - The UUID of the patient
 * @returns {Promise<Object>} A promise that resolves with the predicted data
 */
export const getPatientPredictedScore = async (patientUuid) => {
  const results = await getPredictedScore(patientUuid);

  const predictedData = {
    result: {},
    query: {}
  };

  if (results && results.result.length) {
    predictedData.result = results.result[0];
    predictedData.query = results.sql;
  }

  return predictedData;
};
