'use strict';

const uuid = require('uuid');
const dynamodb = require('../shared/dynamodb');

module.exports.create = (event, context, callback) => {
  const timestamp = new Date().getTime();
  const data = JSON.parse(event.body);
//  if (true || typeof data.text !== 'string') {
//    console.error('Validation Failed');
//    callback(new Error('Couldn\'t create the user item.'));
//    return;
//  }
  var auth0_unique_key = data.sub;
  
  const params = {
    TableName: process.env.DYNAMODB_USER_TABLE,
    Item: {
      id: uuid.v1(),
      uid: auth0_unique_key,
      data: data,
      checked: false,
      createdAt: timestamp,
      updatedAt: timestamp,
    },
  };

  // write the todo to the database
  dynamodb.put(params, (error) => {
    // handle potential errors
    if (error) {
      console.error(error);
      callback(new Error('Couldn\'t create the user item.'));
      return;
    }

    // create a response
    const response = {
      statusCode: 200,
      body: JSON.stringify(params.Item),
    };
    callback(null, response);
  });
};
