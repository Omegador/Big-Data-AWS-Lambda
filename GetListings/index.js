var request = require("request");
var util = require('util');
var zipCodes = require('./data.json');


//
// @about - gathers AirBnB listings from a specified zip code
// @param zip - the zip code to query
// @param cb - callback function
// @return error - return error if there was one
// @return data - return listings if no error
//
function gatherListings(zip, state, cb) {

	var options = {};
 	options.url = "https://www.airbnb.com/api/v2/explore_tabs?version=1.1.0&_format=for_explore_search_web&items_per_grid=60000&fetch_filters=true&supports_for_you_v3=true&timezone_offset=-420&auto_ib=true&tab_id=home_tab&allow_override%5B%5D=&key=d306zoyjsyarp7ifhu67rjxn52tv0t20&currency=USD&locale=en";
	options.headers = {'user-agent': 'Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/57.0.2987.133 Safari/537.36'};
	var data;

	// add zip to querystring parameter
	options.url += "&location=" + zip + "%2C+" + state + "%2C+United+States";

	// DEBUG
	// console.log(options);

	// make the request to airbnb api
	request(options, function(err, response, body) {
  		if(err)	cb(err, null);

  		// crawl through json in body and return the list of listings
		data = JSON.parse(body);
		cb(null, data.explore_tabs[0].sections[0].listings);
  	});
}



/* called by Lambda */
exports.handler = (event, context, callback) => {

    gatherListings(event.zip, event.state, function(err, listings) {
		if(err) console.log("ERROR: %s", err);
		else {

			// create each listing object
			listings.forEach(function(listing) {
				// construct listing object
				intermediaryObject.id = listing.listing.id;
				intermediaryObject.name = listing.listing.name;
				intermediaryObject.beds = listing.listing.beds;
				intermediaryObject.pricePerNight = listing.pricing_quote.rate.amount;
				intermediaryObject.location = {
					lat: listing.listing.lat,
					long: listing.listing.lng
				};

				callback(null, JSON.stringify(intermediaryObject));				
			});

		}
	});
};

/* Manual Run */
if(process.argv == 4 || process.argv[2] == "manual") 
{

	var event = {};
	var intermediaryObject = {};
	var output = [];

	if(process.argv[2] == "manual") {
		// Elko zip code
		event.zip = 89801,
		event.state = "NV"
	} else {
		event.zip = process.argv[2];
		event.state = process.argv[3];		
	}

	console.log("INFO - running in manual mode.");


	gatherListings(event.zip, event.state, function(err, listings) {
		if(err) console.log("ERROR: %s", err);
		else {

			// create each listing object
			listings.forEach(function(listing) {
				// construct listing object
				intermediaryObject.id = listing.listing.id;
				intermediaryObject.name = listing.listing.name;
				intermediaryObject.beds = listing.listing.beds;
				intermediaryObject.pricePerNight = listing.pricing_quote.rate.amount;
				intermediaryObject.location = {
					lat: listing.listing.lat,
					long: listing.listing.lng
				};

				output.push(JSON.stringify(intermediaryObject));

				// DEBUG 
				// console.log("Listing id: %s", listing.listing.id);
				// console.log("Listing name: %s", listing.listing.name);
				// console.log("Number of beds: %s", listing.listing.beds);
				// console.log("Price per night: $%s", listing.pricing_quote.rate.amount);
				// console.log("Location: %s Lat, %s Long", listing.listing.lat, listing.listing.lng);
				// console.log("---------------------------------------------");
			});

			// since this is manual mode, print the output to terminal
			console.log(output);
		}
	});

}

/* Run All */
// only run if 3rd argument is 'all'
if(process.argv[2] == "all") 
{
	zipCodes.forEach( function(element) 
	{
		var event = element;
		var intermediaryObject = {};
		var output = [];

		console.log("INFO - running in manual mode.");


		gatherListings(event.zip, event.state, function(err, listings) {
			if(err) console.log("ERROR: %s", err);
			else {

				// create each listing object
				listings.forEach(function(listing) {
					// construct listing object
					intermediaryObject.id = listing.listing.id;
					intermediaryObject.name = listing.listing.name;
					intermediaryObject.beds = listing.listing.beds;
					intermediaryObject.pricePerNight = listing.pricing_quote.rate.amount;
					intermediaryObject.location = {
						lat: listing.listing.lat,
						long: listing.listing.lng
					};

					output.push(JSON.stringify(intermediaryObject));

					// DEBUG 
					// console.log("Listing id: %s", listing.listing.id);
					// console.log("Listing name: %s", listing.listing.name);
					// console.log("Number of beds: %s", listing.listing.beds);
					// console.log("Price per night: $%s", listing.pricing_quote.rate.amount);
					// console.log("Location: %s Lat, %s Long", listing.listing.lat, listing.listing.lng);
					// console.log("---------------------------------------------");
				});

				// since this is manual mode, print the output to terminal
				console.log(output);
			}
		});
	}

}