var aws = require('aws-sdk');
var zipCodes = require('./data.json');

var lambda = new aws.Lambda({
  accessKeyId: 'AKIAIIEFLYAJX566ZTLA',
  secretAccessKey: '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',
  region: 'us-east-1'
});


zipCodes.forEach(function(zip) {
  //invoke lambda
  lambda.invoke({
    FunctionName: 'GetListings',
    Payload: JSON.stringify({
      zip
    })
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
