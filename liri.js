
require('dotenv').config();

var fs = require("fs");
var moment = require('moment');
var request = require('request');
var Spotify = require('node-spotify-api');

var keys = require("./keys.js");

var bandsInTown = keys.bandsInTown;
var OMDB = keys.omdb;

var liriStart = process.argv[2];

var initLiri;

var dataArr; 

if(process.argv.length > 3) {
    
    initLiri = process.argv.slice(3).join(' ');
    console.log(process.argv.slice(3));
    console.log("initLiri: ", initLiri);

}

function SpotifyThisSong(initSearch) {

    console.log("============================= spotify-this-song =============================");

        var itemCount = 0;
       
        var spotify = new Spotify(keys.spotify);
        
        console.log("initLiri: ", initSearch);

        if ((initSearch !== null) && (initSearch !== undefined)) {
            
        } 

        else {
            initSearch = 'The Sign';
        }

        initSearch = initSearch.trim();
         
        spotify.search({ type: 'track', query: initSearch }).then(function(response) {
                   
        var arrTrack = JSON.parse(JSON.stringify(response.tracks.items));

        console.log("Track Length: ", arrTrack.length);
        console.log("\n=======================================================================\n");
        console.log("Song Name: ", initSearch);

            arrTrack.forEach(output => {
                    
                console.log("\nArtist Name: ", output.artists[0].name);
                console.log("Song Title: ", output.name);
                console.log("Song preview link: ", output.preview_url);
                console.log("Spotify album Link: ", output.external_urls.spotify);
                console.log("Album name: ", output.album.name);
                console.log("\n---------------------------------------")

            });

            }).catch(function(err) {

                console.log(err);

            });
   
}

function concertThis(initSearch) {

    console.log("================================= Concert-this ==============================="); 

    if ((initSearch == null) || (initSearch == undefined)) {

        initSearch = 'Maroon 5';

    } 
    
    var liriBandsURL = "https://rest.bandsintown.com/artists/";
    liriBandsURL += initSearch;
    liriBandsURL += "/events?app_id="
    liriBandsURL += bandsInTown.secret;
    
    request(liriBandsURL, function (error, response, body) {

        console.log("Error:", error); 

        console.log("Status Code:", response && response.statusCode); 

        if (body === "")

            console("empty Body");
        
        var bandInfo = JSON.parse(body);
        
        console.log("\n================================= Concert-This ===============================")
        console.log("\nBand Name: ", initSearch);
        console.log("item count: ", bandInfo.length);

        bandInfo.forEach(element => {
            
            console.log("Venue name: ", element.venue.name);
           
            console.log("Location: ", element.venue.city + ", " + element.venue.country);
            
            console.log("Date: ", moment(element.datetime).format("MM/DD/YYYY") + "\n");

        });
        
    });

}

function movieThis(initSearch) {

    console.log("=================================  Movie-This  ===============================");
            
    var omdbURL = "http://www.omdbapi.com/?t=";
    
    console.log("Search: ", initSearch)

    if((initSearch !== null) && (initSearch !== undefined)) {

        omdbURL += initSearch;

    } 

    else {

        omdbURL += 'Mr. Nobody';

    }

    omdbURL += '&apikey=';
    omdbURL += OMDB.secret;
    
    console.log("OMDBMovieURL: ", omdbURL);

    request(omdbURL, function (error, response, body) {

        console.log('error:', error); 
        console.log('statusCode:', response && response.statusCode); 
        
        var myMovie = JSON.parse(body);

        console.log("================================= Movie-This ===============================\n")
        
        console.log("Movie Title: ", myMovie.Title);
        console.log("Year of release: ", myMovie.Year);
        console.log("IMDB Rating: ", myMovie.imdbRating);
            
        var foundRating = false;

            myMovie.Ratings.forEach(movie => {

                if (movie.source === "Rotten Tomatoes") {

                    foundRating = true;

                    console.log("Rotten Tomatoes Rating", movie.Ratings.Value);

                }

            });

            if (!foundRating) {

                console.log("Rotten Tomatoes Rating:  N/A");

            }

            
        console.log("Country of origin: ", myMovie.Country);
        console.log("Language: ", myMovie.Language);
        console.log("Movie plot: ", myMovie.Plot);
        console.log("Actors: ", myMovie.Actors + "\n");

    });
}

console.log("lirlStart: ", liriStart);

if (!(liriStart == null)) {

    switch (liriStart) {
        
        case 'concert-this':

            concertThis(initLiri);

            break;
       
        case 'spotify-this-song':

            SpotifyThisSong(initLiri);

            break;
       
        case 'movie-this':

            movieThis(initLiri);
    
            break;

        case 'do-what-it-says':

    console.log("============================  do-what-it-says  ============================")
           
        fs.readFile("random.txt", "utf8", function(error, data) {

              
            if (error) {

            return console.log("fs.readFile Error:", error);

            }
            
            console.log("fs.readFile data: ", data);
            var arrFile = data.split('\n')
            console.log("arrFile: ", arrFile);
                
                arrFile.forEach(element => {
                    
                    const dataArr = element.split(",");
                    
                    console.log("dataArr from Random.txt: ", dataArr);

                    var parm = dataArr[1];
                    
                    if ((dataArr[0] !== null) && (dataArr[1] !== null)) {

                        switch (dataArr[0]) {
                           
                            case 'concert-this':
                               
                                concertThis(dataArr[1]);
                    
                                break;
                           
                            case 'spotify-this-song':
                            
                                SpotifyThisSong(dataArr[1]);
                    
                                break;
                            
                            case 'movie-this':

                                movieThis(dataArr[1]);

                                break;

                            default:

                                break;
                        }
                    }

                });

            });


        break;
    
    default:

        console.log(" You hit the default. Try Again");

        break;
    }

}