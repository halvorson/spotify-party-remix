import React from "react";

const Login = props => (
	<div className="jumbotron">
		<div className="text-center">
			<h1>Welcome to Spotify Party Remix</h1>
			<div width="300px">
				<p>
					Give the people what they want.
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
