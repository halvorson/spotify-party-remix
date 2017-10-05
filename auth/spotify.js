var passport = require("passport");
var SpotifyStrategy = require("passport-spotify").Strategy;
var refresh = require("passport-oauth2-refresh");

var User = require("../models/user");
var config = null;
var init = require("./init");

try {
  config = require("../config.js");
} catch (err) {
  console.log(err);
}

let spotifyStrategyItem;
if (config) {
  spotifyStrategyItem = {
    clientID: config.spotify.clientID,
    clientSecret: config.spotify.clientSecret,
    callbackURL: "http://localhost:3001/auth/spotify/callback"
  };
} else {
  spotifyStrategyItem = {
    clientID: process.env.spotifyClientId,
    clientSecret: process.env.spotifyClientSecret,
    callbackURL:
      "https://spotify-party-remix.herokuapp.com/auth/spotify/callback"
  };
}

var spotifyStrategy = new SpotifyStrategy(spotifyStrategyItem, function(
  accessToken,
  refreshToken,
  profile,
  done
) {
  //console.log(profile);
  console.log("_________________Access Token_________________");
  console.log(accessToken);
  console.log("______________________________________________");

  process.nextTick(function() {
    //var retObject = {acsTkn: accessToken};

    var searchQuery = {
      spotifyId: profile.id
    };

    let now = new Date();
    let nowTime = now.getTime();

    var updates = {
      name: profile.displayName,
      accessToken: accessToken,
      refreshToken: refreshToken,
      refreshedTimestamp: nowTime,
    };

    var options = {
      upsert: true
    };

    // update the user if s/he exists or add a new user
    User.findOneAndUpdate(searchQuery, updates, options, function(err, user) {
      if (err) {
        return done(err);
      } else {
        // retObject[user] = user;
        //user.acsTkn = accessToken;
        //console.log(user);
        return done(null, user);
      }
      // retObject[profile] = profile;
      profile.acsTkn = accessToken;
      return done(null, profile);
    });
  });
});

passport.use("spotify", spotifyStrategy);
refresh.use(spotifyStrategy);

init();

module.exports = passport;
