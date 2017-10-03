import axios from "axios";
import openSocket from "socket.io-client";
const socket = openSocket(process.env.PUBLIC_URL || "http://localhost:3001");

// Export an object containing methods we'll use for accessing the Dog.Ceo API

export default {
	searchSpotify: function(searchQuery, type, token) {
		const query = { q: searchQuery, type: type };
		const url = "https://api.spotify.com/v1/search";
		const tokenStr = "Bearer " + token;
		console.log(tokenStr);
		return axios.get(url, {
			params: query,
			headers: {
				Authorization: tokenStr
			}
		});
	},
	getSpotifyPlaylist: function(url, token) {
		const tokenStr = "Bearer " + token;
		console.log(tokenStr);
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
		console.log(process.env);
	},
	subscribeToPlaylistUpdates: (playlistId, cb) => {
		socket.on("refresh", refresh => cb(null, refresh));
		socket.emit("subscribeToPlaylistUpdates", playlistId);
	},
	createPlaylist: function(
		trackList,
		userName,
		token,
		playlistName,
		locationName,
		locationLong,
		locationLat,
		geoLocked,
		isSearchable
	) {
		return new Promise((resolve, reject) => {
			playlistName = "Hello Poppet";
			console.log(trackList);
			const playlistData = {
				trackList: trackList,
				playlistName: playlistName,
				locationName: locationName,
				locationLong: locationLong,
				locationLat: locationLat,
				geoLocked: geoLocked,
				isSearchable: isSearchable,
				creatorUserName: userName,
				totalVotes: 3
			};
			axios
				.post("/api/playlists/", playlistData)
				.then(res => {
					resolve(res);
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
	addTrackToPlaylist: function(track, playlistId) {
		console.log("Api call to add track triggered!");
		return axios.post("api/playlists/" + playlistId + "/addTrack/", {
			track: track
		});
	},
	getDbPlaylist: function(playlistId, userId) {
		console.log(playlistId);
		console.log(userId);
		return axios.get("/api/playlists/" + playlistId + "/user/" + userId);
	},
	deleteSavedArticle: function(id) {
		return axios.delete("/api/articles/" + id);
	},
	saveArticle: function(articleData) {
		return axios.post("/api/articles", articleData);
	}
};
