var q = require('q');
var _ = require('lodash');
var axios = require('axios');
var url = "https://www.airbnb.com/api/v2/explore_tabs?version=1.1.0&_format=for_explore_search_web&items_per_grid=60000&experiences_per_grid=20&guidebooks_per_grid=20&fetch_filters=true&supports_for_you_v3=true&screen_size=large&timezone_offset=-420&auto_ib=true&tab_id=home_tab&location=new+york&allow_override%5B%5D=&ne_lat=40.681477708918884&ne_lng=-73.93761697900504&search_by_map=true&sw_lat=40.65619521873851&sw_lng=-73.95903173577994&zoom=15&federated_search_session_id=82716b6f-57e5-4bd4-a75b-fe1b62ac5e37&_intents=p1&key=d306zoyjsyarp7ifhu67rjxn52tv0t20&currency=USD&locale=en;"

exports.handler = function(event, context, callback) 
{
  //axios request
  axios.get(url).then(function (response) 
  {

   // Invoke more lambda 
   q.all([]).then(function (data) 
   {
       
   })
   
   
   //lambda.invoke(params, function(err, data)
   //{
   //  if (err) console.log(err, err.stack); // an error occurred
   // else     console.log(data);           // successful response
   //}
   //callback(null, response.data);
  
      
  }).catch(function (error) 
  {
    callback(null, 'Error stuff');
  });
};
