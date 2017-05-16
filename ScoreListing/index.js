var request = require("request");
var util = require('util');

// @about - gathers Zillow listings in a small area, centered at the provided latitude/longitude
// @param lat - the latitude at the center of area
// @param long - the longitude at the center of area
// @param cb - callback function
// @return error - return error if there was one
// @return data - return listings if no error
//
function gatherZillowListings(lat, long, cb) 
{
	var options = {};
 	options.url = "https://www.zillow.com/search/GetResults.htm?spt=homes&status=001000&lt=000000&ht=111001&pr=,500000&days=12m&mp=,&bd=0%2C&ba=0%2C&sf=,&lot=0%2C&yr=,&singlestory=0&hoa=0%2C&pho=0&pets=0&parking=0&laundry=0&income-restricted=0&pnd=0&red=0&zso=0&ds=all&pmf=1&pf=1&sch=100111&zoom=15&p=1&sort=globalrelevanceex&search=maplist&rid=13478&rt=6&listright=true&isMapSearch=true&zoom=15";

	options.headers = {'user-agent': 'Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/57.0.2987.133 Safari/537.36'};
	var topleftLong, topleftLat, botRightLong, botRightLat, rect;
	var data;

	/// get coordinates for area to query
	// zillow API wants long of -119.79434821622124 represented as -119794348, 
	// so I multiply by 10^6 and then parseInt() to get rid of remaining floating value
	topleftLong = parseInt( (long - 0.5) * 1000000 );
	topleftLat = parseInt( (lat - 0.5) * 1000000 );
	botRightLong = parseInt( (long + 0.5) * 1000000 );
	botRightLat = parseInt( (lat + 0.5) * 1000000 );

	// construct querystring parameter
	rect = topleftLong + "," + topleftLat + "," + botRightLong + "," + botRightLat;

	// add rect to querystring parameter
	options.url += "&rect=" + rect;

	// DEBUG
	// console.log(URL: options.url);

	// make the request to api
	request(options, function(err, response, body) {
  		if(err)	cb(err, null);

  		// crawl through json in body and return the list of listings
		data = JSON.parse(body);

		console.log("listing: %s", data.map.properties[0]);

		cb(null, data.map.properties);
  	});
}


//
// @about - given Zillow recently-sold listings, extracts data from listings to reduce memory footprint
// @param listings - array of Zillow recently-sold listings
// @return listings - an array of listings as objects
//
function extractDataFromListings(_listings) {
	var listings = [];

	_listings.forEach(function(listing) {
		var obj = {};
		obj.price = listing[8][0];
		obj.sqft = listing[8][3];
		obj.lat = listing[1];
		obj.long = listing[2];

		listings.push(obj);
	});

	return listings;
}


//
// @about - Calculates score and distance for each listing
// @param listings - array of objects representing listings
// @param lat - latitude of AirBnB listing
// @param long - longitude of AirBnB listing
//
function calculateMetaStats(listings, lat, long) {

	listings.forEach(function(listing) {
		// calculate score

		// calculate distance
	})

	// calculate score


	// TODO



}


//
// @about - given the lat and long of an airBnB listing, determines the Z (aka "Zillow" score) at that location
// @param lat - the latitude of the airBnB listing
// @param long - the longitude of the airBnB listings
// @param cb - callback function
// @return error - returns error if there was one
// @return score - returns integer Z score for listing if there was no error
//
function generateZScore(lat, long, cb) {
	var listings, bins, zScore;


	// gather Zillow listings
	gatherZillowListings(lat, long, function(err, listings) {
		if(err) cb(err, null);
		else {

			// extract desired information from each listing
			listings = extractDataFromListings(listings);

			// calculate score & distance for each listing
			calculateMetaStats(listings, lat, long);

			// based on distances, sort listings into bins

			// calculate average scores across bins

			// using average scores from bins, calculate Z score at (lat, long)

			// return Z score
			
			// todo - remove
			cb(null, listings);
		}
	});
}


/* called by Lambda */
exports.handler = (event, context, callback) => {
	/* TODO - Implement. Model after the code from Manual Run */
    callback(null, 'Hello from Lambda');
};


/* Manual Run */
// only run if 3rd argument is 'manual'
if(process.argv[2] == "manual") {
	var event = {
		lat: 39.52273506458795,
		lng: -119.78078512264162
	};
	var output = {};

	console.log("INFO - running in manual mode.");

	// todo - remove
	// gatherZillowListings(39.52273506458795, -119.78078512264162, function(err, listings) {
	// 	if(err) console.log("ERROR: %s", err);
	// 	else {

	// 		// console.log("data: %s", util.inspect(listings, { showHidden: true, depth: null }));
	// 		console.log("number of listings found: %d", listings.length);
	// 	}
	// });

	// generate Z Score
	generateZScore(event.lat, event.lng, function(err, data) {

		console.log("number of listings found: %d", data.length);

		// data.forEach(function(_data) {
		// 	console.log("listing: %s", util.inspect(_data, {showHidden: false, depth: null}));
		// })
	});

}


