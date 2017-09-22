import React, { Component } from "react";
import ResultItem from "./ResultItem";
import API from "../../utils/API";

class ResultItemContainer extends Component {
  constructor() {
    super();
    this.state = {};
  }

  saveArticle = event => {
    event.preventDefault();
    API.saveArticle({
      title: this.props.article.headline.print_headline,
      author: this.props.article.byline.original,
      snippet: this.props.article.snippet
    }).then(res => {
      console.log(res.data);
      this.setState({ saved: true });
      this.props.refreshSavedArticles();
    });
  };

  componentDidMount() {}

  render() {
    return (
      <ResultItem
        article={this.props.article}
        onClick={this.saveArticle}
        btnSaved={this.state.saved}
      />
    );
  }
}

export default ResultItemContainer;
