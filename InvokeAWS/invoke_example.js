var aws = require('aws-sdk');
var zip = require('./data.json');

var lambda = new aws.Lambda({
  accessKeyId: 'AKIAJSAKDSVLYH7ZIZEQ',
  secretAccessKey: '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',
  region: 'us-east-1'
});


zipCodes.forEach(function(zip) {
  //invoke lambda
  lambda.invoke({
    FunctionName: 'GetListings',
    Payload: JSON.stringify({
      zips
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
