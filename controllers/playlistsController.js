const db = require("../models");
const axios = require("axios");
const refresh = require("passport-oauth2-refresh");
const usersController = require("./usersController.js");
const clientsController = require("./clientsController.js");

// Defining methods for the playlistController
module.exports = {
	findAll: function(req, res) {
		db.trackList
			.find(req.query)
			.sort({ date: -1 })
			.then(dbModel => res.json(dbModel))
			.catch(err => {
				console.log(err);
				res.status(422).json(err);
			});
	},
	findById: function(req, res) {
		db.trackList
			.findById(req.params.id)
			.then(dbModel => res.json(dbModel))
			.catch(err => {
				console.log(err);
				res.status(422).json(err);
			});
	},
	getPlaylistById: function(req, res) {
		console.log(req.params.id);
		db.TrackList
			.findById(req.params.playlistId)
			.populate({
				path: "tracks",
				match: { order: { $gte: -5 } },
				options: { sort: { order: 1 } },
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
			})
			.catch(err => {
				console.log(err);
				res.status(422).json(err);
			});
	},
	addTrackToPlaylist: function(req, res) {
		console.log("Api request received to addTrack");
		//console.log("Received body: ");
		//console.log(req.body);
		console.log("playlistId: " + req.params.playlistId);
		//usersController.testCall();
		db.Track
			.create(req.body.track)
			.then(obj => {
				db.TrackList
					.update(
						{ _id: req.params.playlistId },
						{ $push: { tracks: obj._id } }
					)
					.then(tlObj => {
						const voteReq = {
							params: { trackId: obj._id },
							body: {
								voter: obj.addedBy,
								votes: 1
							}
						};
						console.log("Create auto-vote");
						const trackVoteObj = {
							track: obj._id,
							user: obj.addedBy,
							votes: 1
						};
						db.TrackVote
							.create(trackVoteObj)
							.then(tvObj => {
								console.log("Added new trackVote");
								db.Track
									.findOneAndUpdate(
										{ _id: obj._id },
										{
											$inc: {
												totalVotes: 1
											},
											$push: { trackVotes: tvObj._id }
										}
									)
									.exec()
									.then(tObj => {
										//res.json(tObj);
										console.log(
											"Incremented song & pushed to song"
										);
										db.User
											.findOneAndUpdate(
												{ _id: obj.addedBy },
												{
													$push: {
														trackVotes: tvObj._id
													}
												}
											)
											.then(() => {
												console.log("Pushed to user");
												clientsController.refresh(
													req.params.playlistId
												);
												module.exports.reorderPlaylist(
													req.params.playlistId
												);
												res.json();
											})
											.catch(err => {
												console.log(err);
												res.status(422).json(err);
											});
									})
									.catch(err => {
										console.log(err);
										res.status(422).json(err);
									});
							})
							.catch(err => {
								console.log(err);
								res.status(422).json(err);
							});
						//res.json(tObj);
					})
					.catch(err => {
						console.log(err);
						res.status(422).json(err);
					});
			})
			.catch(err => {
				console.log(err);
				res.status(422).json(err);
			});
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
				)
					.then(spotifyPlaylistId => {
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
											SpotifyPlaylistId:
												obj.spotifyPlaylistId
										});
									})
									.catch(err => res.status(422).json(err));
							})
							.catch(err => {
								console.log(err);
								res.status(422).json(err);
							});
					})
					.catch(err => res.status(422).json(err));
			})
			.catch(err => res.status(422).json(err));

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
						module.exports
							.addTracksToSpotify(pl, req.body.trackList, Michael)
							.then(spotifyPlaylistId => {
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
	},
	addTracksToSpotify: (pl, trackList, Michael) => {
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
				let spotifyUri;
				if (typeof t === "string") {
					spotifyUri = t;
				} else {
					spotifyUri = t.spotifyId;
				}
				return "spotify:track:" + spotifyUri;
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
	},
	reorderPlaylist: playlistId => {
		//This needs to reorder the db playlist, then tell each client to update via socket.io
		db.TrackList
			.findById(playlistId)
			.populate({
				path: "tracks"
			})
			.then(obj => {
				var orderIndex = 0;
				var playedTracks = 0;
				var bulkWriteObj = [];
				tracks = obj.tracks;
				var oldTrackList = tracks.map(track => {
					return track.spotifyId;
				});
				console.log(oldTrackList);
				// console.log("--------Tracks before order--------");
				// console.log(tracks);
				tracks.sort(compare);
				var newTrackList = [];
				tracks.forEach((track, index) => {
					track.order = orderIndex++;
					if (track.playedAt) {
						playedTracks++;
					}
					newTrackList.push(track.spotifyId);
					bulkWriteObj.push({
						updateOne: {
							filter: { _id: track._id },
							update: { order: track.order }
						}
					});
				});
				// console.log("--------Tracks after order--------");
				// console.log(tracks);
				// console.log(bulkWriteObj);

				db.Track.bulkWrite(bulkWriteObj).then(res => {
					clientsController.refresh(playlistId);
					console.log("Updated order on tracks");
					if (trackListDidReorder(oldTrackList, newTrackList)) {
						console.log(
							"Playlist changed order -> resyncing with Spotify"
						);
						module.exports.syncWithSpotify(
							obj.spotifyPlaylistId,
							newTrackList,
							playedTracks
						);
					}
				});
			})
			.catch(err => res.status(422).json(err));

		function compare(a, b) {
			if (
				(a.playedAt && !b.playedAt) ||
				a.playedAt < b.playedAt ||
				a.totalVotes > b.totalVotes ||
				(a.totalVotes === b.totalVotes &&
					(a.order < b.order || !b.order))
			)
				return -1;
			if (
				(!a.playedAt && b.playedAt) ||
				a.playedAt > b.playedAt ||
				a.totalVotes < b.totalVotes ||
				(a.totalVotes === b.totalVotes &&
					(a.order > b.order || !a.order))
			)
				return 1;
			return 0;
		}

		function trackListDidReorder(ob, nh) {
			return !(
				ob.length == nh.length &&
				ob.every(function(element, index) {
					return element === nh[index];
				})
			);
		}
	},
	syncWithSpotify: (spotifyPlaylistId, newTrackList, playedTracks) => {
		//This needs to check which songs have played, then reorder the spotify playlist if need be
		//Count number of played songs, then just nuke the next 100 songs
		//Replace based on new order

		//Get Michael's tokens
		db.User
			.findOne({ spotifyId: "michael.t.halvorson" })
			.then((obj, err) => {
				//console.log(err);
				//console.log(obj);
				const Michael = obj;
				const tokenStr = "Bearer " + Michael.accessToken;

				const getSpotifyPlaylistUrl =
					"https://api.spotify.com/v1/users/" +
					obj.spotifyId +
					"/playlists/" +
					spotifyPlaylistId;
				axios
					.get(getSpotifyPlaylistUrl, {
						headers: {
							Authorization: tokenStr,
							"Content-Type": "application/json"
						}
					})
					.then(spl => {
						const spotifyPlaylistSnapshotId = spl.data.snapshot_id;
						//console.log("returned playlist:");
						//console.log(spl.data);
						const splLength = spl.data.tracks.items.length;
						const removeTracksUrl =
							"https://api.spotify.com/v1/users/" +
							obj.spotifyId +
							"/playlists/" +
							spotifyPlaylistId +
							"/tracks";
						let removedPositionArray = [];
						for (let i = playedTracks; i < splLength; i++) {
							removedPositionArray.push(i);
						}
						const deleteBody = {
							positions: removedPositionArray,
							snapshot_id: spotifyPlaylistSnapshotId
						};
						axios
							.delete(removeTracksUrl, {
								data: deleteBody,
								headers: {
									Authorization: tokenStr,
									"Content-Type": "application/json"
								}
							})
							.then(pl => {
								console.log(newTrackList);
								module.exports
									.addTracksToSpotify(
										spl,
										newTrackList,
										Michael
									)
									.then(spotifyPlaylistId => {
										console.log(
											"Just updated spotifyPlaylist: " +
												spotifyPlaylistId
										);
									})
									.catch(err => {
										console.log(err);
										//res.status(422).json(err);
									});
							})
							.catch(err => {
								console.log(err.response.data);

								//res.status(422).json(err);
							});
					})
					.catch(err => {
						console.log("Error coming from syncWithSpotify");
						console.log(err);
						if (err.response.status === 401) {
							usersController.refreshToken(Michael).then(user => {
								syncWithSpotify(
									spotifyPlaylistId,
									newTrackList,
									playedTracks
								);
							});
						} else {
							reject(err);
						}
					});
			})
			.catch(err => {
				console.log(err);
				res.status(422).json(err);
			});
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
