const path = require("path");
const router = require("express").Router();
const apiRoutes = require("./api");
const passportSpotify = require("../auth/spotify");
const usersController = require("../controllers/usersController.js");

// API Routes
router.use("/api", apiRoutes);

// router.get("/", function(req, res) {
// 	res.send("hello, world!");
// });

router.get(
	"/auth/spotify",
	passportSpotify.authenticate("spotify", {
		scope:
			"playlist-modify-public playlist-modify-private " +
			"playlist-read-private playlist-read-collaborative " +
			"ugc-image-upload user-read-private user-read-email " +
			"user-read-playback-state user-read-currently-playing user-modify-playback-state"
	})
);

router.get(
	"/auth/spotify/callback",
	passportSpotify.authenticate("spotify", { failureRedirect: "/login" }),
	function(req, res) {
		// Successful authentication
		//console.log(req.user);
		res.redirect("/");
	}
);

// this route is just used to get the user basic info
router.get("/auth/user", (req, res, next) => {
	console.log("===== user!!======");
	console.log(req.user.spotifyId);
	//console.log(req);
	if (req.user) {
		return res.json({ user: req.user });
	} else {
		return res.json({ user: null });
	}
});

router.get("/auth/refreshToken", (req, res, next) => {
	console.log("-------Refreshing Token--------");
	//console.log("Old token: " + req.user.accessToken);
	usersController.refreshToken(req.user).then(newUser => {
		//console.log("New token:" + newUser.accessToken);
		return res.json({ user: newUser });
	});
});

router.post("/auth/logout", (req, res) => {
	if (req.user) {
		req.session.destroy();
		res.clearCookie("connect.sid"); // clean up!
		return res.json({ msg: "logging you out" });
	} else {
		return res.json({ msg: "no user to log out!" });
	}
});

function authenticationMiddleware() {
	return function(req, res, next) {
		if (req.isAuthenticated()) {
			return next();
		}
		res.redirect("/");
	};
}

router.get("/secured", authenticationMiddleware(), function(req, res) {
	res.send(req.user);
});

// If no API routes are hit, send the React app
router.use(function(req, res) {
	//res.send("hello, world!");

	res.sendFile(path.join(__dirname, "../client/build/index.html"));

	// console.log(
	// 	"this is hitting the catchall at:" +
	// 		__dirname +
	// 		" and sending " +
	// 		path.join(__dirname, "../client/public/index.html")
	// );
	// res.sendFile(path.join(__dirname, "../client/build/index.html"));
});

module.exports = router;
