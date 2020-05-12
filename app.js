require('dotenv').config();

const express = require('express');
const hbs = require('hbs');

// require spotify-web-api-node package here:
const SpotifyWebApi = require('spotify-web-api-node');


const app = express();

app.set('view engine', 'hbs');
app.set('views', __dirname + '/views');
app.use(express.static(__dirname + '/public'));

// setting the spotify-api goes here:
const spotifyApi = new SpotifyWebApi({
    clientId: process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET
  });

// Retrieve an access token
spotifyApi
  .clientCredentialsGrant()
  .then(data => spotifyApi.setAccessToken(data.body['access_token']))
  .catch(error => console.log('Something went wrong when retrieving an access token', error));

// Our routes go here:

//Iteration 3
app.get('/',(req, res) => {
    res.render('home.hbs')
})

//Iteration 3 - Display artists
app.get('/artist-search', (req, res) => {
    console.log('data',req.query)
    spotifyApi
  .searchArtists(req.query.artist)
  .then(data => {
    console.log('The received data from the API: ', data.body.artists.items);
    // ----> 'HERE WHAT WE WANT TO DO AFTER RECEIVING THE DATA FROM THE API'
    let artist = data.body.artists.items;
    res.render('artist-search-results.hbs',{artist}) 

  })
  .catch(err => console.log('The error while searching artists occurred: ', err));
})

//Iteration 4 - View Albums
app.get('/albums/:artistId', (req, res, next) => {
    // .getArtistAlbums() code goes here
    spotifyApi.getArtistAlbums(req.params.artistId)
    .then(data => {
          console.log(data.body.items);
          let albums = data.body.items.map(function(a) {
            return a
          })
          res.render('albums.hbs',{albums}) 
      
        })
        .catch(err => console.log('The error while searching artists occurred: ', err));
      })

//Iteration 5 - 
app.get('/tracks/:albumID', (req, res, next) => {
    // .getArtistAlbums() code goes here
    spotifyApi.getAlbumTracks(req.params.albumID)
    .then(data => {
          console.log(data.body.items);
          let allTracks = data.body.items.map(function(a) {
            return a
          })
          res.render('tracks.hbs',{tracks: allTracks}) 
      
        })
        .catch(err => console.log('The error while searching artists occurred: ', err));
      })

app.listen(3000, () => console.log('My Spotify project running on port 3000 🎧 🥁 🎸 🔊'));
