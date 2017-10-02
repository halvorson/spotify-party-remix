const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// create User Schema
const trackVoteSchema = new Schema({
	track: {
		type: Schema.Types.ObjectId,
		ref: "Track"
	},
	user: {
		type: Schema.Types.ObjectId,
		ref: "User"
	},
	votes: Number
});

module.exports = mongoose.model("TrackVote", trackVoteSchema);
