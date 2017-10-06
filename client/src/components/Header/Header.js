import React from "react";

const Header = props => {
	return (
		<nav className="navbar sticky-top navbar-dark bg-dark" id="mainNav" style={{marginBottom: "1em"}}>
			<a className="navbar-brand" href="/">
				Spotify Party Remix
			</a>
			{props.loggedIn ? (
			<form className="form-inline">
				<button className="btn btn-outline-success" onClick={props.logout}>Logout</button>
			</form>) : null}
		</nav>
	);
};

export default Header;
