'use strict';
const auth = require('../shared/auth');
const dynamodb = require('../shared/dynamodb');
const uuid = require('uuid');


function add_badge(event, context, callback) {
    
  let body = null;
  body = event.body;
  try {
    console.log('Inside HAndle request - event body parsing.');
    body = JSON.parse(event.body);
  } catch(err) {
    // meh
    console.log('Inside HAndle request - event body parse error.');
  }
  var user_id = body.user_id;
  var badge_id = body.badge_id;

  const params = {
    TableName: process.env.DYNAMODB_BADGE_TABLE
//        ProjectionExpression:'id,image,badgeName,max_granted,number_granted',
  };

  dynamodb.scan(params, (error, result) => {
    // handle potential errors
    if (error) {
      console.error(error);
      callback(new Error('Couldn\'t fetch the data from DB.'));
      return;
    }
        const timestamp = new Date().getTime();
        var badge_image_url = getBadgeUrl(badge_id, result.Items);
        const userBadgeParams = {
          TableName: process.env.DYNAMODB_USER_BADGES_TABLE,
          Item: {
            id: uuid.v1(),
            user_id: user_id,
            image_url: badge_image_url,
            badge_id: badge_id,
            createdAt: timestamp,
            reviewed: true,
            updatedAt: timestamp
          }
        };
        
        dynamodb.put(userBadgeParams, (error) => {
          // handle potential errors
          if (error) {
            console.error(error);
            callback(new Error('Couldn\'t add the userbadge item.'));
            return;
          }
          console.log("New user added, returning newly added user");
          
          // create a response
          const response = {
            statusCode: 200,
            body: JSON.stringify(userBadgeParams.Item),
          };
          callback(null, response);
          return;
        });
  });
}

function getBadgeUrl(badge_id, badges)
{
    let badge_image_url = '';
    for(let i=0; i<badges.length;i++)
    {
        if(badge_id==badges[i].id)
        {
            badge_image_url = badges[i].image;
            break;
        }
    }
    return badge_image_url;
}
module.exports.add_badge = add_badge;
