var q = require('q');
var _ = require('lodash');
var fs = require('fs');
var aws = require('aws-sdk');

var config = require('../config.js');
var location = './imgs/';
var numPics = 100;

var lambda = new aws.Lambda({
  accessKeyId: config.AWS.PUB,
  secretAccessKey: config.AWS.PRIV,
  region: config.AWS.REGION
});

fs.readdir(location, function(err, files) {
  _.take(files, numPics).forEach(function(file) {

    //invoke lambda
    q.Promise(function (resolve, reject, notify) {
      lambda.invoke({
        FunctionName: 'testapp',
        Payload: JSON.stringify({
          filename: file
        })
      }, function(error, data) {
        if(error) {
          reject(error);
        }else{
          resolve(data);
        }
      });
    }).then(function (data) {
      //console.log(data);

    }).catch(function (error) {
      console.log('ERROR: ' + error);

    });

  });
});