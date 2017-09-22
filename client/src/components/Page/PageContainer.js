import React, { Component } from "react";
import Page from "./Page";
import API from "../../utils/API";

class PageContainer extends Component {
  constructor() {
    super();
    this.state = {
      searchArticles: [],
      savedArticles: []
    };
  }

  componentWillMount() {
    this.refreshSavedArticles();
  }

  componentDidMount() {}

  searchCallback = searchQueryFromChild => {
    //this.setState({ searchQuery: searchQueryFromChild});
    //console.log(searchQueryFromChild);
    API.getArticles(searchQueryFromChild)
      .then(res => {
        //console.log(res.data);
        this.setState({ searchArticles: res.data.response.docs });
      })
      .catch(err => console.log(err));
  };

  refreshSavedArticles = () => {
    API.getSavedArticles().then(res => {
      //console.log(res.data);
      this.setState({ savedArticles: res.data });
    });
  };

  render() {
    return (
      <Page
        searchCallback={this.searchCallback}
        articles={this.state.searchArticles}
        savedArticles={this.state.savedArticles}
        refreshSavedArticles={this.refreshSavedArticles}
      />
    );
  }
}

export default PageContainer;
