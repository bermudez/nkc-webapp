'use strict';
const auth = require('../shared/auth');
const dynamodb = require('../shared/dynamodb');
const uuid = require('uuid');
function list(event, context, callback) {
  if (!event || !event.headers) {
    callback({
      error: 'Not a valid event object'
    });
  }

  // allows for using callbacks as finish/error-handlers
  context.callbackWaitsForEmptyEventLoop = false;

  console.log('Event Headers found. Now authenticating Request.');
    
  let user;

  return auth(event.headers.Authorization)
    .then(id => user= id)
    .then(user => handleRequest(user, event, callback))
    .catch(err => callback(null, 'Error - '));
}

function handleRequest(user, event, callback) {
  console.log('Inside Handle request!!!');
  console.log('user');
  console.log(user);
//  const profileId = util.getIdFromPath(event.path);
  let body = null;
  
  try {
    console.log('Inside HAndle request - event body parsing.');
//    body = JSON.parse(event.body);
  } catch(err) {
    // meh
    console.log('Inside HAndle request - event body parse error.');
  }
  
    const params = {
        TableName: process.env.DYNAMODB_USER_TABLE,
        ProjectionExpression:'id,uid,email',
        FilterExpression:'uid = :uid',
        ExpressionAttributeValues:{ ":uid" : user.sub }
      };
      
      console.log("Params");
      console.log(params);
      
  // fetch all from the database
  dynamodb.scan(params, (error, result) => {
    // handle potential errors
    if (error) {
      console.error(error);
      callback(new Error('Couldn\'t fetch the data from DB.'));
      return;
    }

    if(result.Items.length!=0)
    {
        console.log("Results count zero. Adding new record");
        const timestamp = new Date().getTime();
        const data = '';//JSON.parse(event.body);
        var user_id = result.Items[0].id;
        const params = {
          TableName: process.env.DYNAMODB_SNAP_TABLE,
          ProjectionExpression:'id,user_id,image_url,venue,venue_title,reviewed,createdAt',
          FilterExpression:'user_id = :user_id',
          ExpressionAttributeValues:{ ":user_id" : user_id }
        };
        
        console.log("Getting data-");
        console.log(params);
        // write to the database
        dynamodb.scan(params, (error, result) => {
          // handle potential errors
          if (error) {
            console.error(error);
            callback(new Error('Couldn\'t get the checkins data.'));
            return;
          }
          
          // create a response
          const response = {
            statusCode: 200,
            body: JSON.stringify(result.Items),
          };
          callback(null, response);
        });
    }
    else
    {
        console.log("Results found returning user");
        const response = {
            statusCode: 401,
            body: "Access Denied. Not valid user."
          };
        console.error('Success');
        callback(null, response);
        return;
    }
    // create a response

  });
//  console.log('Inside HAndle request - event body parse success');
//  callback(null, 'done');
}

module.exports.list = list;
