var q = require('q');
var aws = require('aws-sdk');

var lambda = new aws.Lambda({
  accessKeyId: '',
  secretAccessKey: '',
  region: 'us-east-1'
});

var zipCodes = ['89503', '96162'];


zipCodes.forEach(function(zip) {
  //invoke lambda
  q.Promise(function (resolve, reject, notify) {
    lambda.invoke({
      FunctionName: 'GetListings',
      Payload: JSON.stringify({
        zipcode: zip
      })
    }, function(error, data) {
      if(error) {
        reject(error);
      }else{
        resolve(data);
      }
    });
  }).then(function (data) {
    //success
    console.log(data);

  }).catch(function (error) {
    //error
    console.log('ERROR: ' + error);

  });

});
