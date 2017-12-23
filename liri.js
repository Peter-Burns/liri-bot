var keys = require('./keys.js');
var Twitter = require('twitter');
var Spotify = require('node-spotify-api');
var Request = require('request');
var client = new Twitter({
	consumer_key:keys.consumer_key,
	consumer_secret:keys.consumer_secret,
	access_token_key:keys.access_token_key,
	access_token_secret:keys.access_token_secret,
});
var spotify = new Spotify ({
	id:'427bf7edae9046ff867c149c256bebde',
	secret:'4d22215fd8194aea811826b0a41f173c',
});
function tweetGetter (){
	client.get('favorites/list', function(err,tweets,response){
		if(err)throw err;
		for(i in tweets){
			console.log(tweets[i].user.name);
			console.log(tweets[i].text);
			console.log(tweets[i].created_at + '\n');
		}
	});
}
function spotifyGetter (){
	spotify.search({ type: 'track', query: process.argv[3], limit:1 }, function(err, data) {
		  if (err) {
			      return console.log('Error occurred: ' + err);
			    }
		 
		console.log(data.tracks.items[0].name);
		console.log(data.tracks.items[0].artists[0].name);
		console.log(data.tracks.items[0].album.name);
		console.log(data.tracks.items[0].external_urls.spotify);
	});
}
function movieGetter (){
	request("http://www.omdbapi.com/?t=" + process.argv[3] + "&y=&plot=short&apikey=trilogy", function(error, response, body) {

		if (!error && response.statusCode === 200) {
			console.log("The movie's rating is: " + JSON.parse(body).imdbRating);
		}
	});
}
movieGetter();
