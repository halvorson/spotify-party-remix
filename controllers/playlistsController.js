const db = require("../models");
const axios = require("axios");
const refresh = require("passport-oauth2-refresh");
const usersController = require("./usersController.js");

// Defining methods for the playlistController
module.exports = {
	findAll: function(req, res) {
		db.trackList
			.find(req.query)
			.sort({ date: -1 })
			.then(dbModel => res.json(dbModel))
			.catch(err => res.status(422).json(err));
	},
	findById: function(req, res) {
		db.trackList
			.findById(req.params.id)
			.then(dbModel => res.json(dbModel))
			.catch(err => res.status(422).json(err));
	},
	getPlaylistById: function(req, res) {
		//console.log(req.params.id);
		db.TrackList
			.findById(req.params.playlistId)
			.populate({
				path: "tracks",
				populate: {
					path: "trackVotes",
					match: { _id: req.params.userId },
					model: "TrackVote"
				}
			})
			.exec()
			.then((docs, err) => {
				//console.log(docs);
				res.json(docs);
				//console.log(err);
			});
	},
	addTrackToPlaylist: function(req, res) {
		console.log("Api request received to addTrack");
		//console.log("Received body: ");
		//console.log(req.body);
		console.log("playlistId: " + req.params.playlistId);
		//usersController.testCall();
		db.Track.create(req.body.track).then(obj => {
			db.TrackList.update({_id: req.params.playlistId}, {$push: {tracks: obj._id}}).then(obj => {
				res.json(obj);
			})
		})
	},
	create: function(req, res) {
		// console.log(req.body);
		db.User
			.findOne({ spotifyId: "michael.t.halvorson" })
			.then((obj, err) => {
				//console.log(err);
				//console.log(obj);
				const Michael = obj;
				const newPlaylistUrl =
					"https://api.spotify.com/v1/users/" +
					Michael.spotifyId +
					"/playlists";
				const newPlaylistBody = {
					name: req.body.playlistName,
					public: true,
					description: "Created by " + req.body.creatorUserName
				};
				createNewPlaylist(
					newPlaylistBody,
					newPlaylistUrl,
					Michael,
					req.body
				).then(spotifyPlaylistId => {
					db.Track
						.insertMany(req.body.trackList)
						.then(bwr => {
							//console.log(bwr);
							let trackIds = bwr.map(function(x) {
								return x._id;
							});
							//console.log(trackIds);
							db.TrackList
								.create({
									name: req.body.playlistName,
									locationName: req.body.locationName,
									locationLong: req.body.locationLong,
									locationLat: req.body.locationLat,
									spotifyPlaylistId: spotifyPlaylistId,
									isSearchable: req.body.isSearchable,
									geoLocked: req.body.geoLocked,
									tracks: trackIds
								})
								.then(obj => {
									console.log(
										"New playlist added successfully"
									);
									console.log("SPRId: " + obj._id);
									console.log(
										"SpotifyPlaylistId: " +
											obj.spotifyPlaylistId
									);
									res.json({
										SPRId: obj._id,
										SpotifyPlaylistId: obj.spotifyPlaylistId
									});
								});
						})
						.catch(err => {
							console.log(err);
							res.status(422).json(err);
						});
				});
			});

		const createNewPlaylist = (
			newPlaylistBody,
			newPlaylistUrl,
			Michael,
			playlistInfo
		) => {
			return new Promise((resolve, reject) => {
				const tokenStr = "Bearer " + Michael.accessToken;
				axios
					.post(newPlaylistUrl, newPlaylistBody, {
						headers: {
							Authorization: tokenStr,
							"Content-Type": "application/json"
						}
					})
					.then(pl => {
						addTracks(
							pl,
							req.body.trackList,
							Michael
						).then(spotifyPlaylistId => {
							resolve(spotifyPlaylistId);
						});
					})
					.catch(err => {
						console.log("Error coming from createNewPlaylist");
						console.log(err);
						if (err.response.status === 401) {
							usersController.refreshToken(Michael).then(user => {
								createNewPlaylist(
									newPlaylistBody,
									newPlaylistUrl,
									user,
									playlistInfo
								);
							});
						} else {
							reject(err);
						}
					});
			});
		};

		// moved this to usersController. We'll see if it works; 
		// const refreshToken = oldUser => {
		// 	return new Promise((resolve, reject) => {
		// 		refresh.requestNewAccessToken(
		// 			"spotify",
		// 			oldUser.refreshToken,
		// 			function(err, accessToken, refreshToken) {
		// 				if (err) {
		// 					reject(err);
		// 					return;
		// 				}
		// 				//console.log("response from refresh request:");
		// 				let updates = {};
		// 				if (refreshToken) {
		// 					updates = {
		// 						accessToken: accessToken,
		// 						refreshToken: refreshToken
		// 					};
		// 				} else {
		// 					updates = {
		// 						accessToken: accessToken
		// 					};
		// 				}
		// 				const searchQuery = {
		// 					spotifyId: oldUser.spotifyId
		// 				};
		// 				db.User
		// 					.findOneAndUpdate(searchQuery, updates)
		// 					.then((err, user) => {
		// 						if (err) {
		// 							reject(err);
		// 						} else {
		// 							resolve(user);
		// 						}
		// 					});
		// 			}
		// 		);
		// 	});
		// };

		const addTracks = (pl, trackList, Michael) => {
			return new Promise((resolve, reject) => {
				const tokenStr = "Bearer " + Michael.accessToken;
				const spotifyPlaylistId = pl.data.id;
				const addTracksUrl =
					"https://api.spotify.com/v1/users/" +
					Michael.spotifyId +
					"/playlists/" +
					spotifyPlaylistId +
					"/tracks";
				let spotifyTrackUris = trackList.map(function(t) {
					return "spotify:track:" + t.spotifyId;
				});
				axios
					.post(addTracksUrl, spotifyTrackUris, {
						headers: {
							Authorization: tokenStr
						}
					})
					.then(() => {
						resolve(spotifyPlaylistId);
					})
					.catch(err => {
						reject(err);
					});
			});
			//console.log(pl);
		};
	},
	reorderClientPlaylists: (playlistId) => {
		//This needs to reorder the db playlist, then tell each client to update via socket.io
	},
	syncWithSpotify: (spotifyPlaylistId, playlistId) => {
		//This needs to check which songs have played, then reorder the spotify playlist if need be  
	},
	update: function(req, res) {
		db.trackList
			.findOneAndUpdate({ _id: req.params.id }, req.body)
			.then(dbModel => res.json(dbModel))
			.catch(err => res.status(422).json(err));
	},
	remove: function(req, res) {
		db.trackList
			.findById({ _id: req.params.id })
			.then(dbModel => dbModel.remove())
			.then(dbModel => res.json(dbModel))
			.catch(err => res.status(422).json(err));
	}
};
