import React from "react";
import Header from "../Header";
import SearchContainer from "../Search";
import Container from "../Bootstrap/Container";
import ResultsContainer from "../Results";
import SavedContainer from "../Saved";

const Page = props => (
	<div>
		<Header />
		<Container>
			<SearchContainer searchCallback={props.searchCallback} />
			<ResultsContainer
				articles={props.articles}
				refreshSavedArticles={props.refreshSavedArticles}
			/>
			<SavedContainer
				savedArticles={props.savedArticles}
				refreshSavedArticles={props.refreshSavedArticles}
			/>
		</Container>
	</div>
);

export default Page;
