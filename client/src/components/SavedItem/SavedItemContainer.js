import React, { Component } from "react";
import SavedItem from "./SavedItem";
import API from "../../utils/API";

class SavedItemContainer extends Component {
	constructor() {
		super();
		this.state = {};
	}

	componentDidMount() {}

	deleteArticle = id => {
		API.deleteSavedArticle(id)
			.then(res => this.props.refreshList())
			.catch(err => console.log(err));
	};

	render() {
		return (
			<SavedItem
				article={this.props.article}
				onClick={() => this.deleteArticle(this.props.article._id)}
			/>
		);
	}
}

export default SavedItemContainer;
