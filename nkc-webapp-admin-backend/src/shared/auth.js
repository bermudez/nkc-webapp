'use strict';
const jwt = require('jsonwebtoken');

const AUTH0_DOMAIN = process.env.AUTH0_DOMAIN || null;
const AUTH0_CLIENT = process.env.AUTH0_CLIENT || null;
const AUTH0_SECRET = process.env.AUTH0_SECRET || null;

const credentials = {
  audience: AUTH0_CLIENT,
  issuer: `https://${AUTH0_DOMAIN}/`
};

function authenticate(token) {
  return new Promise((resolve, reject) => {
    if (!token) {
      reject('Authorization token missing.');
    }


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
    const token_a = token.substring(7);
    jwt.verify(token_a, result, credentials, (err, decoded) => {
      if (err) {
          //if erorr is TokenExpiredError --> return 401 http code
          console.log(err);
          console.log("---------------------------------");
          console.log(decoded);
        return reject(err);
      } else {
          console.log(decoded);
          console.log("Event Object - Auth function - ");

        return resolve(decoded);
      }
    });




//    jwt.verify(
//      token.replace('Bearer ', ''),
//      AUTH0_SECRET,
//      credentials,
//      (err, res) => {
//        if (err) {
//            console.log("Error thrown while verifying");
//          return reject(err);
//        }
//        console.log("verifying - Success");
//        return resolve(res.sub);
//      }
//    );
    
    
  });
}

module.exports = authenticate;
