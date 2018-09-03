'use strict';
const auth = require('../shared/auth');
const dynamodb = require('../shared/dynamodb');
const aws = require('aws-sdk');
const uuid = require('uuid');
function upload(event, context, callback) {
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
  console.log(user);
  const params = {
    TableName: process.env.DYNAMODB_USER_TABLE,
    ProjectionExpression:'id,uid,email',
    FilterExpression:'uid = :uid',
    ExpressionAttributeValues:{ ":uid" : user.sub }
  };

  dynamodb.scan(params, (error, result) => {
    // handle potential errors
    if (error) {
      console.error(error);
      callback(new Error('Couldn\'t fetch the data from DB.'));
      return;
    }

    if(result.Items.length!=0)
    {
        let body = JSON.parse(event.body);
        let image_body = body.imageSrc;
        var user_id = result.Items[0].id;
        var s3 = new aws.S3( { params: {Bucket: process.env.USER_IMAGES_S3_BUCKET} } );
        var filetype = "image/jpeg";
        let uuidv4 = require('uuid/v4');
        let filename = uuidv4();
        var data = {
            Key: filename+'.jpeg',
            Body: image_body,
            ContentEncoding: 'base64',
            ContentType: filetype
        };

        aws.config.update({
            accessKeyId: process.env.S3_BUCKET_AWS_ACCESS_KEY,
            secretAccessKey: process.env.S3_BUCKET_AWS_SECRET_KEY
        });
        
        s3.putObject(data, function(err, data) {
            if (err) {
                console.log(err);
                const response = {
                    statusCode: 509,
                    body: "Server side issue."
                  };
                callback(null, response);
                return;
            } else {
                const response = {
                  statusCode: 200,
                  body: JSON.stringify({'filename':filename+'.jpeg', 'filetype':filetype}),
                };
                callback(null, response);
                return;
            }
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
  });
}

module.exports.upload = upload;
