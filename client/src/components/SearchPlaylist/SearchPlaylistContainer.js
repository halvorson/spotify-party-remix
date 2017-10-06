import React, { Component } from "react";
import SearchPlaylist from "./SearchPlaylist";
import API from "../../utils/API";

class SearchPlaylistContainer extends Component {
  constructor() {
    super();
    this.state = {
      searchResults: [],
      searchType: "name",
      hasSearched: false,
      listResults: [],
      gotList: false
    };
  }

  handleInputChange = event => {
    //console.log(event.target);
    const target = event.target;
    const value =
      target.type === "checkbox" || target.type === "ratio"
        ? target.checked
        : target.value;
    const name = target.name;

    this.setState({
      [name]: value
    });
  };

  handleSearchClick = event => {
    event.preventDefault();

    API.searchDbPlaylists(
      this.state.searchTerm,
      this.state.searchType
    ).then(res => {
      //console.log(res);
      this.setState({ searchResults: res.data, hasSearched: true, listResults: [] });
    });
  };

  selectDbPlaylist = e => {
    console.log(e.target);
    this.props.setPlaylistId(e.target.id);
  };

  getAllPlaylists = () => {
    API.getAllPlaylists().then(res => {
      //console.log(res.data);
      this.setState({ listResults: res.data, gotList: true, searchResults: [] });
    });
  };

  componentDidMount() {}

  render() {
    return (
      <div>
        <SearchPlaylist
          handleSearchClick={this.handleSearchClick}
          handleInputChange={this.handleInputChange}
          searchType={this.state.searchType}
          searchTerm={this.state.searchTerm}
          searchResults={this.state.searchResults}
          selectDbPlaylist={this.selectDbPlaylist}
          getAllPlaylists={this.getAllPlaylists}
          listResults={this.state.listResults}
          createNewPlaylist={this.props.createNewPlaylist}
        >
        </SearchPlaylist>
      </div>
    );
  }
}

export default SearchPlaylistContainer;
