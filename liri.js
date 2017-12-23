var keys = require('./keys.js');
var fs = require('fs');
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
function spotifyGetter (query){
	spotify.search({ type: 'track', query: query, limit:1 }, function(err, data) {
		  if (err) {
			      return console.log('Error occurred: ' + err);
			    }
		var song = data.tracks.items[0]; 
		console.log(song.name);
		console.log(song.artists[0].name);
		console.log(song.album.name);
		console.log(song.external_urls.spotify);
	});
}
function movieGetter (query){
	Request("http://www.omdbapi.com/?t=" + query + "&y=&plot=short&apikey=trilogy", function(error, response, body) {

		if (!error && response.statusCode === 200) {
			var movie = JSON.parse(body);
			console.log(movie.Title);
			console.log(movie.Ratings[0].Value);
			console.log(movie.Ratings[1].Value);
			console.log(movie.Country);
			console.log(movie.Language);
			console.log(movie.Actors);
			console.log(movie.Plot);
		}
	});
}
function parseFunc (){
	fs.readFile('random.txt','utf8',function(err,data){
		if(err)return console.log(err);
		data = data.split(',');
		switch(data[0]){
			case 'my-tweets':
				tweetGetter();
				break;
			case 'spotify-this-song':
				spotifyGetter(data[1]);
				break;
			case 'movie-this':
				movieGetter(data[1]);
				break;
			default:
				console.log('Invalid file format');
		}
	});
}
switch(process.argv[2]){
	case 'my-tweets':
		tweetGetter();
		break;
	case 'spotify-this-song':
		spotifyGetter(process.argv[3]);
		break;
	case 'movie-this':
		movieGetter(process.argv[3]);
		break;
	case 'do-what-it-says':
		parseFunc();
		break;
	default:
		console.log('Invalid method');
}
