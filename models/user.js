const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// create User Schema
const userSchema = new Schema({
	name: String,
	googleId: String,
	spotifyId: String,
	accessToken: String,
	refreshToken: String,
	trackVotes: [
		{
			type: Schema.Types.ObjectId,
			ref: "TrackVote"
		}
	]
});

module.exports = mongoose.model("User", userSchema);
