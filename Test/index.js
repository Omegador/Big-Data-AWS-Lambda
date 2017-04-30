var q = require('q');
var _ = require('lodash');
var axios = require('axios');

exports.handler = function(event, context, callback) {
  //axios request
  axios.get('https://www.bitstamp.net/api/v2/ticker/btcusd/').then(function (response) {
    callback(null, JSON.stringify(response.data));

  }).catch(function (error) {
    callback(null, 'Error stuff');

  });
};
