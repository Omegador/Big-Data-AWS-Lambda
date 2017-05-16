var q = require('q');
var aws = require('aws-sdk');
var Vibrant = require('node-vibrant');

var s3 = new aws.S3({
  accessKeyId: '',
  secretAccessKey: '',
  region: 'us-east-1'
});


exports.handler = function(event, context, callback) {

  //analyse photo
  q.fcall(function () {
    //get from s3
    return q.Promise(function (resolve, reject, notify) {
      s3.getObject({
        Bucket: 'bigdatalambda',
        Key: event.filename
      }, function(error, data) {
        if(error) reject(error);
        else resolve(data);
      });
    });
  }).then(function (data) {

    //analyse photo
    return q.Promise(function (resolve, reject, notify) {
      Vibrant.from(data.Body).getPalette(function(error, palette) {
        if(error) reject(error);
        resolve({
          Vibrant: ((palette.Vibrant) ? palette.Vibrant.getHex() : ''),
          LightVibrant: ((palette.LightVibrant) ? palette.LightVibrant.getHex() : ''),
          DarkVibrant: ((palette.DarkVibrant) ? palette.DarkVibrant.getHex() : ''),
          Muted: ((palette.Muted) ? palette.Muted.getHex() : ''),
          LightMuted: ((palette.LightMuted) ? palette.LightMuted.getHex() : ''),
          DarkMuted: ((palette.DarkMuted) ? palette.DarkMuted.getHex() : '')
        });
      });
    });

  }).then(function (data) {
    callback(null, data);

  }).catch(function (error) {
    callback(null, 'ERROR: '+error);

  });

};