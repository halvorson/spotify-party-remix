const db = require("../models");
const clientsController = require("./clientsController.js");
const playlistsController = require("./playlistsController.js");

// Defining methods for the tracksController
module.exports = {
	voteForTrack: function(req, res) {
		const trackVoteObj = {
			track: req.params.trackId,
			user: req.body.voter,
			votes: req.body.votes
		};
		db.TrackVote
			.create(trackVoteObj)
			.then(obj => {
				console.log("Added new trackVote");
				db.Track
					.findOneAndUpdate(
						{ _id: req.params.trackId },
						{
							$inc: { totalVotes: req.body.votes },
							$push: { trackVotes: obj._id }
						}
					)
					.exec()
					.then(tObj => {
						//res.json(tObj);
						console.log("Incremented song & pushed to song");
						db.User
							.findOneAndUpdate(
								{ _id: req.body.voter },
								{ $push: { trackVotes: obj._id } }
							)
							.then(() => {
								console.log("Pushed to user");
								clientsController.refresh(req.body.playlistId);
								playlistsController.reorderPlaylist(req.body.playlistId);
								res.json();
							})
							.catch(err => res.status(422).json(err));
					})
					.catch(err => res.status(422).json(err));
			})
			.catch(err => res.status(422).json(err));
	}
};
