'use strict';
const jwt = require('jsonwebtoken');

const AUTH0_DOMAIN = process.env.AUTH0_DOMAIN || null;
const AUTH0_CLIENT = process.env.AUTH0_CLIENT || null;
const AUTH0_SECRET = process.env.AUTH0_SECRET || null;

// Policy helper function
const generatePolicy = (principalId, effect, resource) => {
  const authResponse = {};
  authResponse.principalId = principalId;
  if (effect && resource) {
    const policyDocument = {};
    policyDocument.Version = '2012-10-17';
    policyDocument.Statement = [];
    const statementOne = {};
    statementOne.Action = 'execute-api:Invoke';
    statementOne.Effect = effect;
    statementOne.Resource = resource;
    policyDocument.Statement[0] = statementOne;
    authResponse.policyDocument = policyDocument;
  }
  console.log('authResponse-');
  console.log(authResponse);
  return authResponse;
};

// Reusable Authorizer function, set on `authorizer` field in serverless.yml
module.exports.auth = (event, context, cb) => {
  if (event.authorizationToken) {
    // remove "bearer " from token
    const token = event.authorizationToken.substring(7);
    console.log("Token: ");
    console.log(token);
    console.log("Auth0 Client: ");
    console.log(AUTH0_CLIENT);
    
    const credentials = {
        audience: AUTH0_CLIENT,
        algorithms: ["HS256","RS256"]
      };
      console.log('AUTH0_SECRET');
      console.log(AUTH0_SECRET);
    

    var cert = AUTH0_SECRET;


    //Certificate must be in this specific format or else the function won't accept it
    var beginCert = "-----BEGIN CERTIFICATE-----";
    var endCert = "-----END CERTIFICATE-----";

    cert = cert.replace("\n", "");
    cert = cert.replace(beginCert, "");
    cert = cert.replace(endCert, "");

    var result = beginCert;
    while (cert.length > 0) {
        if (cert.length > 64) {
            result += "\n" + cert.substring(0, 64);
            cert = cert.substring(64, cert.length);
        }
        else {
            result += "\n" + cert;
            cert = "";
        }
    }

    if (result[result.length ] != "\n")
    {
        result += "\n";
    }
    result += endCert + "\n";
    
    console.log('Formated - pub key: ');
    console.log(result);
    console.log(' :Formated - pub key end');
    jwt.verify(token, result, credentials, (err, decoded) => {
      if (err) {
          //if erorr is TokenExpiredError --> return 401 http code
          console.log(err);
          console.log("---------------------------------");
          console.log(decoded);
        cb('Unauthorized - Authentication failed.');
      } else {
          console.log(decoded);
          console.log("Event Object - Auth function - ");
          console.log(event);
        cb(null, generatePolicy(decoded.sub, 'Allow', event.methodArn));
      }
    });
  } else {
    cb('Unauthorized - token not passed');
  }
};