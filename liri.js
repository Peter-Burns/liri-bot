require('dotenv').config();
var keys = require('./keys.js');
var fs = require('fs');
var Twitter = require('twitter');
var Spotify = require('node-spotify-api');
var Request = require('request');
var client = new Twitter(keys.twitter);
var spotify = new Spotify (keys.spotify);
function tweetGetter (){
	client.get('statuses/user_timeline', function(err,tweets,response){
		if(err)throw err;
		var tweetData = [];
		for(i in tweets){
			console.log(tweets[i].user.name);
			console.log(tweets[i].text);
			console.log(tweets[i].created_at + '\n');
			tweetData.push(tweets[i].user.name,tweets[i].text,tweets[i].created_at);
		}
		fs.appendFile('log.txt',tweetData,function(err){if(err)return console.log(err)});
	});
}
function spotifyGetter (query){
	if(!query)query = 'The Sign Ace of Base';
	spotify.search({ type: 'track', query: query, limit:1 }, function(err, data) {
		  if (err) {
			      return console.log('Error occurred: ' + err);
			    }
		var song = data.tracks.items[0]; 
		console.log(song.name);
		console.log(song.artists[0].name);
		console.log(song.album.name);
		console.log(song.external_urls.spotify);
		var songData = [song.name,song.artists[0].name,song.album.name,song.external_urls.spotify];
		fs.appendFile('log.txt',songData,function(err){if(err)return console.log(err)});
	});
}
function movieGetter (query){
	if(!query)query = 'Mr. Nobody';
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
			var movieData = [movie.Title, movie.Ratings[0].Value,movie.Ratings[1].Value,movie.Country,movie.Language,movie.Actors,movie.Plot];
			fs.appendFile('log.txt',movieData,function(err){if(err)return console.log(err)});
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
fs.appendFile('log.txt','\n\n#' + process.argv[2] + '\n\n', function(err){if(err)return console.log(err)});
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
