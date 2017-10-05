import React, { Component } from "react";

const ellipsis = {
	textOverflow: "ellipsis",
	whiteSpace: "nowrap",
	overflowX: "hidden"
};

const PlaylistRow = props => (
	<div
		id={props.playlist._id}
		className={"list-group-item list-group-item-action "}
		style={{ padding: 0 }}
		onClick={props.onClick}
	>
		<div className="d-flex justify-content-start" id={props.playlist._id}>
			<div className="p-2" id={props.playlist._id}>
				{props.playlist.name}
			</div>
		</div>
	</div>
);

/*
	<div className="row" onClick={props.onClick}>
		<div className="col-sm-12">
			<h6 style={ellipsis} id={props.playlist._id}>
				{props.playlist.name}
				{props.children}
			</h6>
		</div>
	</div>
	*/

export default PlaylistRow;
