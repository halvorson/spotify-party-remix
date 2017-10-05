const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// create User Schema
const trackListSchema = new Schema({
  name: String,
  nameLower: { type: String, lowerCase: true },
  locationName: String,
  locationLong: String,
  locationLat: String,
  spotifyPlaylistId: String,
  isSearchable: Boolean,
  geoLocked: Number,
  createdBy: { type: Schema.Types.ObjectId, ref: "User" },
  tracks: [
    {
      type: Schema.Types.ObjectId,
      ref: "Track"
    }
  ]
});

module.exports = mongoose.model("TrackList", trackListSchema);
