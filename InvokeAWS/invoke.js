var aws = require('aws-sdk');
var zipCodes = require('./data.json');

var config = require('../config.js');

var lambda = new aws.Lambda({
  accessKeyId: config.AWS.PUB,
  secretAccessKey: config.AWS.PRIV,
  region: config.AWS.REGION
});


zipCodes.forEach(function(zip) {
  //invoke lambda
  lambda.invoke({
    FunctionName: 'GetListings',
    Payload: JSON.stringify(zip)
  }, function(error, data) {
    if(error) {
      //error
      console.log(error);
    }else{
      //success
      console.log(data);
    }
  });

});
