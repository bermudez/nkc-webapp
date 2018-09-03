'use strict';

const dynamodb = require('../shared/dynamodb');

module.exports.user_snaps_list = (event, context, callback) => {
    console.log('Event object: ');
    console.log(event);
    let user_id = null;
    if (event.queryStringParameters !== null && event.queryStringParameters !== undefined) {
        if (event.queryStringParameters.user_id !== undefined && event.queryStringParameters.user_id !== null && event.queryStringParameters.user_id !== "") {
            user_id = event.queryStringParameters.user_id;
        }
    }
    if (!user_id && event.query !== null && event.query !== undefined) {
        if (event.query.user_id !== undefined && event.query.user_id !== null && event.query.user_id !== "") {
            user_id = event.query.user_id;
        }
    }
    
    console.log(event);
    
    var params = {};
    if(user_id)
    {
        console.log("USERID: " + user_id);
        params = 
        {
          TableName: process.env.DYNAMODB_SNAP_TABLE,
          ProjectionExpression:'id,user_id,image_url,venue,venue_title,reviewed,createdAt',
          FilterExpression:'user_id = :user_id',
          ExpressionAttributeValues: { ":user_id" : user_id }
        };
    }
    else
    {
        console.log("USERID not found, getting all records.");
        params = {
            TableName: process.env.DYNAMODB_SNAP_TABLE,
          };
    }
 
  dynamodb.scan(params, (error, result) => {
    // handle potential errors
    if (error) {
      console.error(error);
      callback(new Error('Couldn\'t fetch the user snaps.'));
      return;
    }

    // create a response
    const response = {
      statusCode: 200,
      body: JSON.stringify(result.Items),
    };
    callback(null, response);
  });
};
