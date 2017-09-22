import React, { Component } from "react";
import Search from "./Search";

class SearchContainer extends Component {
  constructor() {
    super();
    this.state = {};
  }

  handleInputChange = event => {
    const target = event.target;
    const value = target.type === "checkbox" ? target.checked : target.value;
    const name = target.name;

    this.setState({
      [name]: value
    });
  };

  handleFormSubmit = event => {
    event.preventDefault();
    this.props.searchCallback({
      q: this.state.searchTerm,
      begin_date: (this.state.startYear || '2016') + "0101",
      end_date: (this.state.endYear || '2017') + "1231"
    });
  };

  componentDidMount() {}

  render() {
    return (
      <Search
        handleFormSubmit={this.handleFormSubmit}
        handleInputChange={this.handleInputChange}
      />
    );
  }
}

export default SearchContainer;
