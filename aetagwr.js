const mongoose = require("mongoose");
const db = require("./models");

console.log("I'm alive!!");

// Set up promises with mongoose
mongoose.Promise = global.Promise;
// Connect to the Mongo DB
mongoose
	.connect(
		process.env.MONGODB_URI || "mongodb://localhost/spotify-party-remix",
		{
			useMongoClient: true
		}
	)
	.then(
		db.Track
			.insertMany([
				{
					name: "If I Lose Myself - Alesso vs OneRepublic",
					artist: "OneRepublic",
					album: "If I Lose Myself (Alesso vs OneRepublic)",
					spotifyId: "1YDJ2f1JuKzYWZpRYiBYHu",
					albumArtSmallUrl:
						"https://i.scdn.co/image/d63a878363d1efe276c4656aad2d5b10d89261b1"
				},
				{
					name: "Alive",
					artist: "Empire of the Sun",
					album: "Alive",
					spotifyId: "7tqG3RAo8h9pHxCJFn7bZb",
					albumArtSmallUrl:
						"https://i.scdn.co/image/59deb49f37842de5ee6cfa5b5d81d04d338e065b"
				}
			])
			.then(bwr => {
				console.log("is this working?");
				console.log(bwr);
			})
			.catch(err => {
				console.log(err);
				res.status(422).json(err);
			})
	);
