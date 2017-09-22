import React, { Component } from "react";
import ResultItemContainer from "../ResultItem";

const Results = props => (
	<div className="card">
		<h4 className="card-header bg-primary text-white">Results</h4>
		<ul className="list-group list-group-flush">
			{props.articles.map(article => {
				if (
					article.headline.print_headline &&
					article.byline.original
				) {
					return (
						<ResultItemContainer
							article={article}
							refreshSavedArticles={props.refreshSavedArticles}
						/>
					);
				}
				return;
			})}
		</ul>
	</div>
);

export default Results;
