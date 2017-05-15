var aws = require('aws-sdk');

var lambda = new aws.Lambda({
  accessKeyId: '',
  secretAccessKey: '',
  region: 'us-east-1'
});

var zipCodes = ['89503', '96162'];


zipCodes.forEach(function(zip) {
  //invoke lambda
  lambda.invoke({
    FunctionName: 'testapp',
    Payload: JSON.stringify({
      zipcode: zip
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
