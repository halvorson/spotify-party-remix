const router = require("express").Router();
const playlistsController = require("../../controllers/playlistsController");

// Matches with "/api/playlists"
router
	.route("/")
	.get(playlistsController.findAll)
	.post(playlistsController.create);

// Matches with "/api/playlists/:id"
router
	.route("/:id")
	.get(playlistsController.getPlaylistById)
	.put(playlistsController.update)
	.delete(playlistsController.remove);

router
	.route("/:playlistId/user/:userId")
	.get(playlistsController.getPlaylistById);

router
	.route("/:playlistId/addTrack/")
	.post(playlistsController.addTrackToPlaylist);

module.exports = router;