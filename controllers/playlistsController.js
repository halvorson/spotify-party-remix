const db = require("../models");
const axios = require("axios");
const refresh = require("passport-oauth2-refresh");
const usersController = require("./usersController.js");
const clientsController = require("./clientsController.js");

let playlistTimeouts = {};
// Defining methods for the playlistController
module.exports = {
	findAll: function(req, res) {
		db.TrackList
			.find({})
			.sort({ _id: -1 })
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
		//console.log(req.params.id);
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
		//console.log("playlistId: " + req.params.playlistId);
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
										nameLower: req.body.playlistName.toLowerCase(),
										locationName: req.body.locationName,
										locationLong: req.body.locationLong,
										locationLat: req.body.locationLat,
										spotifyPlaylistId: spotifyPlaylistId,
										isSearchable: req.body.isSearchable,
										geoLocked: req.body.geoLocked,
										createdBy: req.body.createdBy,
										tracks: trackIds,
										totalVotes: totalVotes
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
				usersController.checkUserAndRefresh(Michael).then(user => {
					const tokenStr = "Bearer " + user.accessToken;
					axios
						.post(newPlaylistUrl, newPlaylistBody, {
							headers: {
								Authorization: tokenStr,
								"Content-Type": "application/json"
							}
						})
						.then(pl => {
							module.exports
								.addTracksToSpotify(
									pl,
									req.body.trackList,
									Michael
								)
								.then(spotifyPlaylistId => {
									resolve(spotifyPlaylistId);
								})
								.catch(err => res.status(422).json(err));
						})
						.catch(err => {
							console.log("Error coming from createNewPlaylist");
							console.log(err);
							if (err.response.status === 401) {
								usersController
									.refreshToken(Michael)
									.then(user => {
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
			});
		};
	},
	addTracksToSpotify: (pl, trackList, Michael) => {
		return new Promise((resolve, reject) => {
			const spotifyPlaylistId = pl.data.id;
			const addTracksUrl =
				"https://api.spotify.com/v1/users/" +
				Michael.spotifyId +
				"/playlists/" +
				spotifyPlaylistId +
				"/tracks";
			console.log(trackList);
			let spotifyTrackUris = trackList.map(function(t) {
				let spotifyUri;
				console.log(t);
				if (typeof t === "string") {
					spotifyUri = t;
				} else {
					spotifyUri = t.spotifyId;
				}
				return "spotify:track:" + spotifyUri;
			});
			console.log("Adding tracks to Spotify: " + spotifyTrackUris);
			usersController
				.checkUserAndRefresh(Michael)
				.then(user => {
					const tokenStr = "Bearer " + user.accessToken;
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
		console.log(
			"newTrackList at beginning of syncWithSpotify: " + newTrackList
		);

		//Get Michael's tokens
		db.User
			.findOne({ spotifyId: "michael.t.halvorson" })
			.then((obj, err) => {
				//console.log(err);
				//console.log(obj);
				const Michael = obj;

				const getSpotifyPlaylistUrl =
					"https://api.spotify.com/v1/users/" +
					obj.spotifyId +
					"/playlists/" +
					spotifyPlaylistId;

				usersController
					.checkUserAndRefresh(Michael)
					.then(user => {
						const tokenStr = "Bearer " + user.accessToken;
						axios
							.get(getSpotifyPlaylistUrl, {
								headers: {
									Authorization: tokenStr,
									"Content-Type": "application/json"
								}
							})
							.then(spl => {
								const spotifyPlaylistSnapshotId =
									spl.data.snapshot_id;
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

								if (splLength - playedTracks <= 0) {
									if (splLength === 0) {
										console.log(
											"Spotify playlist has length of 0 " +
												"Something must have errored out. " +
												"Adding full playlist..."
										);
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
												console.log(
													"syncWithSpotify failed at adding new tracks"
												);
												//res.status(422).json(err);
											});
									} else {
										console.log(
											"warning: trying to delete 0 tracks. " +
												"Something must have errored out. " +
												"Nuking playlist and starting over..."
										);
										for (let i = 0; i < splLength; i++) {
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
													"Content-Type":
														"application/json"
												}
											})
											.then(pl => {
												console.log(
													"Deleted all tracks. Now adding " +
														newTrackList
												);
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
														console.log(
															"syncWithSpotify failed at adding new tracks"
														);
														//res.status(422).json(err);
													});
											})
											.catch(err => {
												console.log(
													"syncWithSpotify failed at deleting tracks"
												);

												//res.status(422).json(err);
											});
									}
								} else {
									for (
										let i = playedTracks;
										i < splLength;
										i++
									) {
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
												"Content-Type":
													"application/json"
											}
										})
										.then(pl => {
											console.log(
												"Adding tracks: " + newTrackList
											);
											module.exports
												.addTracksToSpotify(
													spl,
													newTrackList.splice(
														playedTracks,
														newTrackList.length -
															playedTracks
													),
													Michael
												)
												.then(spotifyPlaylistId => {
													console.log(
														"Just updated spotifyPlaylist: " +
															spotifyPlaylistId
													);
												})
												.catch(err => {
													console.log(
														"syncWithSpotify failed at adding new tracks"
													);
													//res.status(422).json(err);
												});
										})
										.catch(err => {
											console.log(
												"syncWithSpotify failed at deleting tracks"
											);

											//res.status(422).json(err);
										});
								}
							})
							.catch(err => {
								console.log(
									"Error coming from syncWithSpotify"
								);
								console.log(err);
								if (err.response.status === 401) {
									usersController
										.refreshToken(Michael)
										.then(user => {
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
						console.log(
							"Error coming from syncWithSpotify triggered by refreshToken"
						);
						console.log(err);
					});
			})
			.catch(err => {
				console.log(err);
				res.status(422).json(err);
			});
	},
	startPlaying: (req, res) => {
		//console.log(req.body);

		db.User
			.findById(req.body.userId)
			.then(uObj => {
				db.TrackList
					.findById(req.body.playlistId)
					.populate({
						path: "tracks",
						options: { sort: { order: 1 } }
					})
					.then(plObj => {
						//Replace with ID match once we fully populate the new playlists
						if (true) {
							var bulkWriteObj = [];

							res.status(200).json({
								success: true,
								spotifyPlaylistId: plObj.spotifyPlaylistId
							});
							let now = new Date();
							let lastTime = now.getTime();
							//console.log("MS timestamp: " + lastTime);
							//console.log(req.body.trackNum);
							let duration =
								plObj.tracks[req.body.trackNum].duration;
							bulkWriteObj.push({
								updateOne: {
									filter: {
										_id: plObj.tracks[req.body.trackNum]._id
									},
									update: {
										playedAt: lastTime,
										hasPlayed: false,
										isPlaying: true
									}
								}
							});
							lastTime = lastTime - plObj.tracks[req.body.trackNum].duration;
							for (let i = req.body.trackNum - 1; i >= 0; i--) {
								//console.log(plObj.tracks[i].playedAt);
								if (plObj.tracks[i].playedAt) {
									lastTime = plObj.tracks[i].playedAt - 1;
									bulkWriteObj.push({
										updateOne: {
											filter: {
												_id: plObj.tracks[i]._id
											},
											update: {
												hasPlayed: true,
												isPlaying:
													i === req.body.trackNum
											}
										}
									});
								} else {
									bulkWriteObj.push({
										updateOne: {
											filter: {
												_id: plObj.tracks[i]._id
											},
											update: {
												playedAt: lastTime,
												hasPlayed: true,
												isPlaying:
													i === req.body.trackNum
											}
										}
									});
									lastTime =
										lastTime - plObj.tracks[i].duration;
								}
							}
							for (
								let i = req.body.trackNum + 1;
								i < plObj.tracks.length;
								i++
							) {
								bulkWriteObj.push({
									updateOne: {
										filter: {
											_id: plObj.tracks[i]._id
										},
										update: {
											playedAt: null,
											hasPlayed: false,
											isPlaying: false
										}
									}
								});
							}
							console.log(bulkWriteObj);
							if (bulkWriteObj) {
								db.Track
									.bulkWrite(bulkWriteObj)
									.then(res => {
										console.log(
											"Started Playing (track no. " +
												req.body.trackNum +
												")."
										);
										clientsController.refresh(
											req.body.playlistId
										);
										if (
											playlistTimeouts[
												req.body.playlistId
											]
										) {
											clearTimeout(
												playlistTimeouts[
													req.body.playlistId
												]
											);
											console.log(
												"Destroyed old timeout!"
											);
										}
										playlistTimeouts[
											req.body.playlistId
										] = setTimeout(function() {
											module.exports.updatePlaying(
												req.body.playlistId,
												req.body.trackNum
											);
										}, duration);
									})
									.catch(err => {
										console.log(
											"startPlaying failed trying to update timestamps"
										);
										console.log(err);
									});
							} else {
								res
									.status(200)
									.json({ text: "nothing to update" });
							}
						} else {
							res
								.status(422)
								.json({ text: "Only the host can hit play" });
						}
					})
					.catch(err => {
						console.log(err);
						res.status(422).json(err);
					});
			})
			.catch(err => {
				console.log(err.response.data);
				res.status(422).json(err);
			});
	},
	updatePlaying: (playlistId, nowPlayingTrackNum) => {
		const nextTrackNum = nowPlayingTrackNum + 1;
		console.log("Finishing track " + nowPlayingTrackNum);
		db.TrackList
			.findById(playlistId)
			.populate({
				path: "tracks",
				options: { sort: { order: 1 } }
			})
			.then(plObj => {
				let bulkWriteObj = [];
				let now = new Date();
				let nowTime = now.getTime();
				const duration = plObj.tracks[nextTrackNum].duration;
				bulkWriteObj.push({
					updateOne: {
						filter: {
							_id: plObj.tracks[nowPlayingTrackNum]._id
						},
						update: {
							hasPlayed: true,
							isPlaying: false
						}
					}
				});
				bulkWriteObj.push({
					updateOne: {
						filter: {
							_id: plObj.tracks[nextTrackNum]._id
						},
						update: {
							isPlaying: true,
							playedAt: nowTime
						}
					}
				});
				db.Track.bulkWrite(bulkWriteObj).then(res => {
					console.log(
						"Playing next track (no. " + nextTrackNum + ")."
					);
					clientsController.refresh(playlistId);
					if (playlistTimeouts[playlistId]) {
						clearTimeout(playlistTimeouts[req.body.playlistId]);
						console.log("Destroyed old timeout!");
					}
					playlistTimeouts[
						playlistId
					] = setTimeout(function() {
						module.exports.updatePlaying(playlistId, nextTrackNum);
					}, duration);
				});
			});
	},
	searchPlaylists: (req, res) => {
		//console.log("Params from searchPlaylists:");
		//console.log(req.query);
		let searchField;
		if (req.query.searchType === "name") {
			searchField = "nameLower";
		} else if (req.query.searchType === "creator") {
			searchField = "createdBy.spotifyId";
		} else {
			console.log("Search error: not looking for name or creator");
			return res
				.status(422)
				.json({ error: "can only search for name or creator" });
		}
		db.TrackList
			// .populate({
			// 	path: "createdBy"
			// })
			.find({
				[searchField]: {
					$regex: req.query.searchTerm.toLowerCase(),
					$options: "i"
				}
			})
			.sort({ _id: -1 })
			.then(obj => {
				//console.log(obj);
				res.status(200).json(obj);
			})
			.catch(err => res.status(422).json(err));
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
