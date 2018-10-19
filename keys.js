console.log('this is loaded');

exports.spotify = {
  id: process.env.SPOTIFY_ID,
  secret: process.env.SPOTIFY_SECRET
};


exports.bandsInTown = {
    secret: process.env.bandsInTown_SECRET
};

exports.omdb = {
    secret: process.env.OMDB_SECRET
};