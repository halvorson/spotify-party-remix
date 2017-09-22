import React, { Component } from "react";
import Saved from "./Saved";

class SavedContainer extends Component {

	refreshList = () => {
		//console.log("Refreshing from savedContainer");
		this.props.refreshSavedArticles();
	};

	componentWillMount() {
		this.refreshList();
		//console.log(this.props.savedArticles);
	}

	render() {
		return <Saved articles={this.props.savedArticles} refreshList={this.refreshList} />;
	}
}

export default SavedContainer;
