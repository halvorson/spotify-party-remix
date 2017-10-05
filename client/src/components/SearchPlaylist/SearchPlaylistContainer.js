import React, { Component } from "react";
import SearchPlaylist from "./SearchPlaylist";
import API from "../../utils/API";
import PlaylistRow from "../PlaylistRow";

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

  handleFormSubmit = event => {
    event.preventDefault();

    API.searchDbPlaylists(
      this.state.searchTerm,
      this.state.searchType
    ).then(res => {
      //console.log(res);
      this.setState({ searchResults: res.data, hasSearched: true });
    });
  };

  selectDbPlaylist = (e) => {
    console.log(e.target);
    this.props.setPlaylistId(e.target.id);
  };

  getAllPlaylists = () => {
    API.getAllPlaylists().then(res => {
      //console.log(res.data);
      this.setState({ listResults: res.data, gotList: true });
    });
  };

  componentDidMount() {}

  render() {
    return (
      <div>
        <SearchPlaylist
          handleFormSubmit={this.handleFormSubmit}
          handleInputChange={this.handleInputChange}
          searchType={this.state.searchType}
          searchTerm={this.state.searchTerm}
        >
          <div className="container">
          <div className="list-group">
            {this.state.searchResults.map(item => {
              return (
                <PlaylistRow
                  playlist={item}
                  key={item._id}
                  onClick={this.selectDbPlaylist}
                />
              );
            })}
          </div>
          </div>
          <div>
            <h4 className="text-center">---OR---</h4>
            <div className="col-sm-12">
              <button
                className="btn btn-primary btn-block"
                onClick={this.getAllPlaylists}
              >
                Select from list
              </button>
            </div>
          </div>
          <div className="container">
          <div className="list-group">
            {this.state.listResults.map(item => {
              return (
                <PlaylistRow
                  playlist={item}
                  key={item._id}
                  onClick={this.selectDbPlaylist}
                />
              );
            })}

          </div>
          </div>
          <div>
            <h4 className="text-center">---OR---</h4>
            <div className="col-sm-12">
              <button
                className="btn btn-primary btn-block"
                onClick={this.props.createNewPlaylist}
              >
                Create a new one
              </button>
            </div>
          </div>
        </SearchPlaylist>
      </div>
    );
  }
}

export default SearchPlaylistContainer;
