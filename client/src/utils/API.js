import axios from "axios";
import openSocket from "socket.io-client";
const socket = openSocket(
	process.env.NODE_ENV === "development"
		? "http://localhost:3001/"
		: "https://spotify-party-remix.herokuapp.com"
);

// Export an object containing methods we'll use for accessing the Dog.Ceo API

export default {
	searchSpotify: function(searchQuery, type, token) {
		const query = { q: searchQuery, type: type };
		const url = "https://api.spotify.com/v1/search";
		const tokenStr = "Bearer " + token;
		// console.log(tokenStr);
		return axios.get(url, {
			params: query,
			headers: {
				Authorization: tokenStr
			}
		});
	},
	getAllPlaylists: () => {
		return axios.get("/api/playlists");
	},
	getSpotifyPlaylist: function(url, token) {
		const tokenStr = "Bearer " + token;
		//console.log(tokenStr);
		return axios.get(url, {
			headers: {
				Authorization: tokenStr
			}
		});
	},
	getSpotifyPlaylists: function(userName, token) {
		const tokenStr = "Bearer " + token;
		//console.log(tokenStr);
		const url =
			"https://api.spotify.com/v1/users/" + userName + "/playlists";
		return axios.get(url, {
			headers: {
				Authorization: tokenStr
			}
		});
	},
	getUser: () => {
		return new Promise((resolve, reject) => {
			axios.get("/auth/user").then(response => {
				//console.log(response.data);
				if (!!response.data.user) {
					resolve(response.data.user);
				} else {
					reject(response.error);
				}
			});
		});
	},
	refreshUserToken: user => {
		return new Promise((resolve, reject) => {
			axios.get("/auth/refreshToken").then(user => {
				//console.log(response.data);
				resolve(user);
			});
		});
	},
	subscribeToTimer: (interval, cb) => {
		socket.on("timer", timestamp => cb(null, timestamp));
		socket.emit("subscribeToTimer", interval);
		console.log(process.env.NODE_ENV);
	},
	subscribeToPlaylistUpdates: (playlistId, cb) => {
		socket.on("refresh", refresh => cb(null, refresh));
		socket.emit("subscribeToPlaylistUpdates", playlistId);
	},
	unsubscribeFromSocket: () => {
		socket.removeAllListeners("timer");
		socket.removeAllListeners("refresh");
	},
	unsubscribeFromTimer: () => {
		socket.emit("unsubscribeFromTimer", null);
	},
	createPlaylist: function(
		trackList,
		userName,
		token,
		playlistName,
		locationName,
		creator,
		locationLong,
		locationLat,
		geoLocked,
		isSearchable
	) {
		return new Promise((resolve, reject) => {
			//console.log(trackList);
			const playlistData = {
				trackList: trackList,
				playlistName: playlistName || "Untitled",
				createdBy: creator,
				locationName: locationName,
				locationLong: locationLong,
				locationLat: locationLat,
				geoLocked: geoLocked,
				isSearchable: isSearchable,
				creatorUserName: userName,
				totalVotes: 3
			};
			console.log(playlistData);
			axios
				.post("/api/playlists/", playlistData)
				.then(res => {
					resolve(res);
					console.log(res.data);
					const spotifyPlaylistId = res.data.SpotifyPlaylistId;
					const spotifyFollowUrl =
						"https://api.spotify.com/v1/users/" +
						"michael.t.halvorson" +
						"/playlists/" +
						spotifyPlaylistId +
						"/followers";
					const tokenStr = "Bearer " + token;
					axios
						.put(
							spotifyFollowUrl,
							{},
							{
								headers: {
									Authorization: tokenStr
								}
							}
						)
						.then(res2 => {
							console.log(
								"You're now to the playlist you created. " +
									"Check spotify to watch it evolve."
							);
						})
						.catch(err => {
							console.log(err);
						});
				})
				.catch(err => {
					reject(err);
				});
		});
	},
	voteForTrack: function(trackId, userId, votes, playlistId) {
		console.log("voting for playlistId: " + playlistId);
		return axios.post("/api/tracks/" + trackId + "/vote", {
			voter: userId,
			votes: votes,
			playlistId: playlistId
		});
	},
	startPlaying: (user, playlistId, trackNum, spotifyPlaylistId) => {
		axios
			.post("/api/playlists/start", {
				requestorSpotifyId: user.spotifyId,
				requestorUserId: user._id,
				playlistId: playlistId,
				trackNum: trackNum
			})
			.then(res => {
				//console.log(res);
				if (res.data.success) {
					const spotifyPlayUrl =
						"https://api.spotify.com/v1/me/player/play";
					const tokenStr = "Bearer " + user.accessToken;
					const contextUriStr =
						"spotify:user:" +
						user.spotifyId +
						":playlist:" +
						res.data.spotifyPlaylistId;
					//console.log(contextUriStr);
					//console.log(trackNum);
					// const shuffleUrl =
					// 	"https://api.spotify.com/v1/me/player/shuffle";

					axios
						.put(
							spotifyPlayUrl,
							{
								context_uri: contextUriStr,
								offset: { position: trackNum }
							},
							{
								headers: {
									Authorization: tokenStr
								}
							}
						)
						.then(res2 => {
							if ((res2.status === 204)) {
								const nextTrackUrl =
									"https://api.spotify.com/v1/me/player/next";
								axios
									.post(
										nextTrackUrl,
										{},
										{
											headers: {
												Authorization: tokenStr,
												"Content-Type":
													"application/json"
											}
										}
									)
									.then(resSkip => {
										console.log("Started playing!");
									});
							}
						});
				}
			});
	},
	addTrackToPlaylist: function(track, playlistId) {
		console.log("Api call to add track triggered!");
		return axios.post("/api/playlists/" + playlistId + "/addTrack", {
			track: track
		});
	},
	getDbPlaylist: function(playlistId, userId) {
		//console.log(playlistId);
		//console.log(userId);
		return axios.get("/api/playlists/" + playlistId + "/user/" + userId);
	},
	searchDbPlaylists: function(searchTerm, searchType) {
		console.log(searchType + ": " + searchTerm);
		return axios.get("/api/playlists/search", {
			params: { searchTerm: searchTerm, searchType: searchType }
		});
	},
	deleteSavedArticle: function(id) {
		return axios.delete("/api/articles/" + id);
	},
	saveArticle: function(articleData) {
		return axios.post("/api/articles", articleData);
	}
};
