'use strict';
const CONSTANTS = require('./constants');

/**
 * Checks if input subject is object or not
 * @param {mixed} subject - input data to check if it is object or not
 * @return {boolean} true on success false if no
 */
function isResponseObject(subject) {
  return typeof response === 'object' && response.statusCode && response.headers && response.body;
}

/**
 * @param {integer} statusCode - http status code
 * @param {object} response - response object
 */
function formatResponse(statusCode, response) {
  // Check if we have a valid response object, and if so, return it
  if (isResponseObject(response)) {
    return response;
  }

  let data = '';
  let message = '';
  try {
    message = 'Success';
    if (response) {
      data = response;
    } else {
      data = '';
    }
  } catch(err) {
    message = 'Error';
    data = response.toString();
  }

var responseBody = {
            message: message,
            data: data
            // event:event
        };
  var return_response = {
    statusCode: statusCode || CONSTANTS.STATUS_CODES.OK,
    headers: {
      'Access-Control-Allow-Origin': '*'
    },
    body: JSON.stringify(responseBody)
  };
  console.log('RAW return response');
  console.info(return_response);
  return return_response;
}

function respondAndClose(callback, response, statusCode) {
  console.log('Inside respondAndClose');
  return callback(null, formatResponse(statusCode, response));
}

const idRegex = /^\/(.*?)(\/|$)/;
function getIdFromPath(path) {
  const match = idRegex.exec(path);
  return match && match[1];
}

module.exports = {
  respondAndClose,
  getIdFromPath,
  formatResponse
};
