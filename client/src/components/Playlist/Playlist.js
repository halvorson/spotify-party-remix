import React, { Component } from "react";

const Playlist = props => (
	<div className="card">
		<h4 className="card-header bg-primary text-white">Current Playlist</h4>

		{props.children}
	</div>
);

export default Playlist;
