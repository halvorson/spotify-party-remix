const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// create User Schema
const trackSchema = new Schema({
	name: String,
	artist: String,
	album: String,
	spotifyId: String,
	albumArtSmallUrl: String,
	albumArtMedUrl: String,
	albumArtLargeUrl: String,
	totalVotes: { type: Number, default: 0 },
	trackVotes: [
		{
			type: Schema.Types.ObjectId,
			ref: "TrackVote"
		}
	],
	addedBy: {
		type: Schema.Types.ObjectId,
		ref: "User"
	},
	isPlaying: { type: Boolean, default: false },
	hasPlayed: { type: Boolean, default: false },
	playedAt: {type: Number, default: null},
	duration: Number,
	order: {type: Number, default: 150}
	//Need to populate duration throughout
});

module.exports = mongoose.model("Track", trackSchema);
