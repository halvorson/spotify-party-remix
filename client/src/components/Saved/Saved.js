import React, { Component } from "react";
import SavedItemContainer from "../SavedItem";

const Saved = props => (
	<div className="card">
		<h4 className="card-header bg-primary text-white">Saved Articles</h4>
		<ul className="list-group list-group-flush">
			{props.articles.map(article => {
				return <SavedItemContainer article={article} refreshList={props.refreshList}/>;
			})}
		</ul>
	</div>
);

export default Saved;
