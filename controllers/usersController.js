const db = require("../models");
const axios = require("axios");
const refresh = require("passport-oauth2-refresh");

module.exports = {
	testCall: () => {
		console.log("Test call triggered");
	},
	checkUserAndRefresh: oldUser => {
		return new Promise((resolve, reject) => {
			let now = new Date();
			let nowTime = now.getTime();
			if (oldUser.refreshedTimestamp > now.getTime - 55 * 60 * 1000) {
				resolve(user);
			} else {
				resolve(module.exports.refreshToken(oldUser));
			}
		});
	},
	refreshToken: oldUser => {
		return new Promise((resolve, reject) => {
			refresh.requestNewAccessToken(
				"spotify",
				oldUser.refreshToken,
				function(err, accessToken, refreshToken) {
					if (err) {
						reject(err);
						return;
					}
					//console.log("response from refresh request:");
					let updates = {};
					let now = new Date();
					let nowTime = now.getTime();
					updates = {
						accessToken: accessToken,
						refreshedTimestamp: nowTime
					};
					if (refreshToken) {
						updates.refreshToken = refreshToken;
					}
					const searchQuery = {
						spotifyId: oldUser.spotifyId
					};
					db.User
						.findOneAndUpdate(searchQuery, updates)
						.then(user => {
							resolve(user);
						})
						.catch(err => {
							reject(err);
						});
				}
			);
		});
	}
};
