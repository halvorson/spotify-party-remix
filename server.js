const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const routes = require("./routes");
const app = express();
const passport = require("passport");
const session = require("express-session");
const MongoStore = require("connect-mongo")(session);
const PORT = process.env.PORT || 3001;
const server = require("http").Server(app);
const io = require("socket.io")(server);
const clientsController = require('./controllers/clientsController');
clientsController.start(io);

// Configure body parser for AJAX requests
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Set up promises with mongoose
mongoose.Promise = global.Promise;
// Connect to the Mongo DB
mongoose.connect(
	process.env.MONGODB_URI || "mongodb://localhost/spotify-party-remix",
	{
		useMongoClient: true
	}
);

var logger = function(req, res, next) {
	console.log("GOT REQUEST !");
	console.log(req);
	next(); // Passing the request to the next handler in the stack.
};

//app.use(logger);

//Set up session to use MongoStore
app.use(
	session({
		store: new MongoStore({
			mongooseConnection: mongoose.connection
		}),
		secret: "keyboard cat",
		resave: true,
		saveUninitialized: true
	})
);

app.use(passport.initialize());
app.use(passport.session());

// Serve up static assets
app.use(express.static("client/build"));

// Add routes, both API and view
app.use(routes);

// Start the API server
server.listen(PORT, function() {
	console.log(`🌎  ==> API Server now listening on PORT ${PORT}!`);
});


