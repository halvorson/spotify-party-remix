import React, { Component } from "react";

const SavedItem = props => (
	<li className="list-group-item" key={props.article._id}>
		{props.article.title} {props.article.author}
		<button className="btn pull-right btn-danger" onClick={props.onClick}>
			Delete
		</button>
	</li>
);

export default SavedItem;
