const router = require("express").Router();
const trackRoutes = require("./tracks");
const playlistRoutes = require("./playlists");


// Playlist routes
router.use("/playlists", playlistRoutes);

router.use("/tracks", trackRoutes);

module.exports = router;
