import React, { Component } from "react";

const Login = props => (
	<div className="jumbotron">
		<div className="text-center">
			<h1>Welcome to Spotify Party Remix</h1>
			<div width="300px">
				<p>
					Not sure what people want to hear? Let them decide.
				</p>
			</div>
			<a href="/auth/spotify">
				<button className="btn btn-primary">
					Login with Spotify to Continue
				</button>
			</a>
		</div>
	</div>
);

export default Login;
