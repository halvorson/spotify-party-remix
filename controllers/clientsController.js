var connectedClients = [];
var counter = 0;
var io;

module.exports = {
	start: io2 => {
		io = io2;
		io.on("connection", client => {
			client.on("subscribeToTimer", interval => {
				console.log(
					"client is subscribing to timer with interval ",
					interval
				);
				setInterval(() => {
					client.emit("timer", new Date(), function(err, data) {
						console.log(data);
					});
				}, interval);
			});
			client.on("subscribeToPlaylistUpdates", playlistId => {
				console.log(
					"Client is subscribed to playlist pushes for playlist: " +
						playlistId
				);
				counter++;
				console.log("Counter: " + counter);
				//console.log(connectedClients);
				connectedClients.push({
					client: client,
					playlistId: playlistId
				});
				var lookingAtThisPlaylist = 0;
				//console.log(connectedClients);
				connectedClients.forEach(function(item, index) {
					console.log("ClientId of client " + index + ": " + item.client.id);
					if (item.playlistId === playlistId) {
						lookingAtThisPlaylist++;
					}
				});
				console.log(
					"There are now " + lookingAtThisPlaylist + " clients looking at that playlist"
				);
				// setInterval(() => {
				// 	client.emit("dummy", false, function(err, data) {
				// 		console.log(data);
				// 	});
				// }, 1000);
			});
			client.on("disconnect", () => {
				console.log("Someone disconnected");
				console.log(client.id);
				var removalIndex;
				connectedClients.forEach(function(item, index) {
					if (item.client.id === client.id) {
						removalIndex = index;
					}
				});
				//connectedClients.splice(removalIndex, 1);
			});
		});
	},
	refresh: playlistId => {
		console.log("Refreshing clients looking at playlistId: " + playlistId);
		connectedClients.forEach(function(item) {
			console.log("ClientId is " + item.playlistId);
			if (item.playlistId === playlistId) {
				console.log("playlistId matches!");
				item.client.emit("refresh", true);
			}
		});
	}
};
