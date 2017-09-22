import React, { Component } from "react";
import Results from "./Results";

class SearchContainer extends Component {
  constructor() {
    super();
    this.state = {};
  }

  render() {
    return (
      <Results articles={this.props.articles} refreshSavedArticles={this.props.refreshSavedArticles} />
    );
  }
}

export default SearchContainer;
