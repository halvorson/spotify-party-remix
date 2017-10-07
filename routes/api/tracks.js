const router = require("express").Router();
const tracksController = require("../../controllers/tracksController");

// Matches with "/api/tracks/"
router
  .route("/:trackId/vote/")
  .post(tracksController.voteForTrack)

module.exports = router;
