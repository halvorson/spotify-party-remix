# Spotify Party Remix

## Brief overview

This app allows for crowdsourcing a Spotify playlist so everybody can have a say what music is playing at the party/in the car, etc.

## Using it

1. Host creates a playlist (requires Spotify Premium)
2. Host shares link with partygoers, who can add new tracks and vote on existing ones <small>(note: deep linking across registration doesn't work, so they'll need to click, register, then click again)</small>
3. When party starts, host enters host mode (it's a button), then clicks "play" <small>(note: it'll play on most recent Spotify device, so you might have to start Spotify on whichever computer/phone you want to listen to) (note2: turn off shuffle)</small>
4. As playlist plays, app will reorder tracks based on crowd demand

## Tech used

MERN, Spotify API (via Axios), Passport.js (for Spotify auth), Socket.io, Koala, 

## Next steps

1. Push data via socket.io (currently pushes a refresh request)
2. Deep link across new user registration 
3. Enabled Facebook and Google login for non-Spotify users
