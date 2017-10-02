const mongoose = require('mongoose');
const Schema = mongoose.Schema;


// create User Schema
const trackListSchema = new Schema({
  name: String,
  locationName: String,
  locationLong: String,
  locationLat: String,
  spotifyPlaylistId: String,
  isSearchable: Boolean,
  geoLocked: Number,
  tracks: [{
    type: Schema.Types.ObjectId,
    ref: "Track"
  }]
});


module.exports = mongoose.model('TrackList', trackListSchema);