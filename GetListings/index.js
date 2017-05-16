var request = require("request");
var util = require('util');


//
// @about - gathers AirBnB listings from a specified zip code
// @param zip - the zip code to query
// @param cb - callback function
// @return error - return error if there was one
// @return data - return listings if no error
//
function gatherListings(zip, cb) {
	var options = {};
 	options.url = "https://www.airbnb.com/api/v2/explore_tabs?version=1.1.0&_format=for_explore_search_web&items_per_grid=60000&fetch_filters=true&supports_for_you_v3=true&timezone_offset=-420&auto_ib=true&tab_id=home_tab&allow_override%5B%5D=&key=d306zoyjsyarp7ifhu67rjxn52tv0t20&currency=USD&locale=en";
	options.headers = {'user-agent': 'Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/57.0.2987.133 Safari/537.36'};
	var data;

	// add zip to querystring parameter
	options.url += "&location=" + zip;

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


function generateScores() {
  // TODO
}


// TODO - create one general function that both the export and Manual run will call to start the program


/* called by Lambda */
exports.handler = (event, context, callback) => {
	/* TODO - Implement. Model after the code from Manual Run */
    callback(null, 'Hello from Lambda');
};

/* Manual Run */
// only run if 3rd argument is 'manual'
if(process.argv[2] == "manual") 
{

	var event = {
		// Elko zip code
		zip: 89801	
	};
	var intermediaryObject = {};
	var output = [];

	console.log("INFO - running in manual mode.");


	gatherListings(event.zip, function(err, listings) {
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