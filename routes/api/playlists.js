const router = require("express").Router();
const playlistsController = require("../../controllers/playlistsController");

// Matches with "/api/playlists"
router
	.route("/")
	.get(playlistsController.findAll)
	.post(playlistsController.create);

router.route("/start").post(playlistsController.startPlaying);

router.route("/search").get(playlistsController.searchPlaylists);

// Matches with "/api/playlists/:id"

router.route("/:id/reset").put(playlistsController.resetPlaylist);

router.route("/:id/sync").put(playlistsController.forceSync);

router
	.route("/:id")
	.get(playlistsController.getPlaylistById)
	.put(playlistsController.update)
	.delete(playlistsController.remove);

router
	.route("/:playlistId/user/:userId")
	.get(playlistsController.getPlaylistById);

router
	.route("/:playlistId/addTrack")
	.post(playlistsController.addTrackToPlaylist);

module.exports = router;
