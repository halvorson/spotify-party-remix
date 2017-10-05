var connectedClients = {};
var clientTimers = {};
var counter = 0;
var io;

removeOld = (playlistId, clientId) => {
	//used when someone subscribes to a playlist, or when someone disconnects
	let removalIndex;
	connectedClients[playlistId].forEach((client, index) => {
		if (client.id === clientId) {
			removalIndex = index;
		}
	});
	if (removalIndex || removalIndex === 0) {
		connectedClients[playlistId].splice(removalIndex, 1);
	}
};

module.exports = {
	start: io2 => {
		io = io2;
		io.on("connection", client => {
			client.on("subscribeToTimer", interval => {
				console.log(
					"client is subscribing to timer with interval ",
					interval
				);
				const intervalId = setInterval(() => {
					client.emit("timer", new Date(), function(err, data) {
						console.log(data);
					});
				}, interval);
				clientTimers[client.id] = intervalId;
			});
			client.on("unsubscribeFromTimer", () => {
				clearInterval(clientTimers[client.id]);
				delete clientTimers[client.id];
			});
			client.on("subscribeToPlaylistUpdates", playlistId => {
				console.log(
					"Client is subscribed to playlist pushes for playlist: " +
						playlistId
				);
				//counter++;
				//console.log("Counter: " + counter);

				//NEed to add a bit here about checking to see if the client already exists, then overriding playlist id if so

				if (!connectedClients[playlistId]) {
					connectedClients[playlistId] = [];
				}

				removeOld(playlistId, client.id);

				connectedClients[playlistId].push(client);

				// connectedClients.push({
				// 	client: client,
				// 	playlistId: playlistId
				// });
				var lookingAtThisPlaylist = connectedClients[playlistId].length;

				//console.log(connectedClients);
				// connectedClients.forEach(function(item, index) {
				// 	console.log("ClientId of client " + index + ": " + item.client.id);
				// 	if (item.playlistId === playlistId) {
				// 		lookingAtThisPlaylist++;
				// 	}
				// });
				// for (let key in connectedClients) {
				// 	let value = connectedClients[key];
				// 	console.log(key + ": " + value);
				// 	if (value === playlistId) {
				// 		lookingAtThisPlaylist++;
				// 	}
				// }
				console.log(
					"There are now " +
						lookingAtThisPlaylist +
						" clients looking at that playlist"
				);
				// setInterval(() => {
				// 	client.emit("dummy", false, function(err, data) {
				// 		console.log(data);
				// 	});
				// }, 1000);
			});
			client.on("disconnect", () => {
				Object.keys(connectedClients).forEach((playlistId, index) => {
					removeOld(playlistId, client.id);
				});
			});
		});
	},
	refresh: playlistId => {
		console.log("Refreshing clients looking at playlistId: " + playlistId);
		if (connectedClients[playlistId]) {
			connectedClients[playlistId].forEach((client, index) => {
				client.emit("refresh", true);
			});
		} else {
			console.log("Nobody is listening!");
		}
		// for (let key in connectedClients) {
		// 	let value = connectedClients[key];
		// 	//console.log(key + ": " + value);
		// 	if (value === playlistId) {
		// 		item.client.emit("refresh", true);
		// 	}
		// }
	}
};
