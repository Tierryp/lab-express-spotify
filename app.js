require('dotenv').config();

const express = require('express');
const hbs = require('hbs');

const SpotifyWebApi = require("spotify-web-api-node");

const app = express();

app.set('view engine', 'hbs');
app.set('views', __dirname + '/views');
app.use(express.static(__dirname + '/public'));

const spotifyApi = new SpotifyWebApi({
  clientId: process.env.CLIENT_ID,
  clientSecret: process.env.CLIENT_SECRET
});

app.get("/", (req, res, next) => {
res.render("index")
});

app.get("/artist-search" , (req,res,next) => {
  // console.log(req.query.artistName, "THIS IS THE QUERY ARTIST NAME");
  spotifyApi.searchArtists(req.query.artistName)
  .then((data) => {
      let artistResults = data.body.artists.items;
      console.log('Search artists by "Drake"', data.body.artists.items);
      res.render('artist-search-results', {artistResults})

    })
    .catch((err) => {
      console.error(err);
    })
  })

  app.get("/albums/:artistId", (req, res, next) => {
  spotifyApi.getArtistAlbums(req.params.artistId)
  .then((data) => {
      let albums = data.body.items 

      console.log("Artist albums", data.body.items);
       res.render("albums",{albums})
       //console.log(albums)
    })
    .catch((err) => {
      console.error(err);
    })
  })
 
  app.get("/tracks/:trackId", (req,res,next) => {
    
    spotifyApi
    .getAlbumTracks(req.params.trackId)
    .then((data) => {
          let tracks = data.body.items
            console.log("Tracks", data.body.items);
            res.render('tracks', {tracks})
            // res.send("ok")
          })
          .catch((err)=> {
            console.log("Something went wrong!", err);
          })

   });

// spotifyApi
//   .searchArtists(req.query.artistName)
//   .then((data) => {
//     console.log("The received data from the API: ", data.body);
//     // ----> 'HERE WHAT WE WANT TO DO AFTER RECEIVING THE DATA FROM THE API'
//   })
//   .catch((err) =>
//     console.log("The error while searching artists occurred: ", err)
//   );




// Retrieve an access token
spotifyApi
  .clientCredentialsGrant()
  .then(data => spotifyApi.setAccessToken(data.body['access_token']))
  .catch(error => console.log('Something went wrong when retrieving an access token', error));



app.listen(3000, () => console.log('My Spotify project running on port 3000 🎧 🥁 🎸 🔊'));
