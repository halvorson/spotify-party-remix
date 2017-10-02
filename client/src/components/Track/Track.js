import React, { Component } from "react";

const Track = props => (
	<div className="row">
		<div className="col-sm-12">
			<h6 key={props.track.id}>
				{props.track.name} by {props.track.artist || props.track.artists[0].name}
				{props.children}
			</h6>
		</div>
	</div>
);

export default Track;
