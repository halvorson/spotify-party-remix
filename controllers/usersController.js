const db = require("../models");
const axios = require("axios");
var refresh = require("passport-oauth2-refresh");

module.exports = {
	testCall: () => {
		console.log("Test call triggered");
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
					if (refreshToken) {
						updates = {
							accessToken: accessToken,
							refreshToken: refreshToken
						};
					} else {
						updates = {
							accessToken: accessToken
						};
					}
					const searchQuery = {
						spotifyId: oldUser.spotifyId
					};
					db.User
						.findOneAndUpdate(searchQuery, updates)
						.then((err, user) => {
							if (err) {
								reject(err);
							} else {
								resolve(user);
							}
						});
				}
			);
		});
	}
};
