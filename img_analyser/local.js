var q = require('q');
var _ = require('lodash');
var axios = require('axios');
var fs = require('fs');
var Vibrant = require('node-vibrant');

var location = './jpg/';
var numPics = 50;

fs.readdir(location, function(err, files) {
  return _.take(files, numPics).reduce(function (chain, curr) {
    return chain.then(function (prev) {
      //code here
      return q.Promise(function (resolve, reject, notify) {

        Vibrant.from(location+curr).getPalette(function(error, palette) {
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

      }).then(function (data) {
        //console.log(data);

      }).catch(function (error) {
        console.log('ERROR: ' + error);

      });

    }).catch(function (error) {
      return chain;
    });
  }, q([]));
});