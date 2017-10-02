import React, { Component } from "react";
import Search from "./Search";
import API from "../../utils/API";
import Track from "../Track";
import TrackAddButton from "../TrackAddButton";

class SearchContainer extends Component {
  constructor() {
    super();
    this.state = { searchResults: [] };
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
    API.searchSpotify(
      this.state.searchTerm,
      "track",
      this.props.user.accessToken
    )
      .then(res => {
        console.log(res.data.tracks.items);
        this.setState({ searchResults: res.data.tracks.items });
      })
      .catch(err => console.log(err));
  };

  componentDidMount() {}

  render() {
    return (
      <div>
        <Search
          handleFormSubmit={this.handleFormSubmit}
          handleInputChange={this.handleInputChange}
        >
          <div>
            {this.state.searchResults.map(item => {
              return (
                <Track track={item} key={item.id}>
                  <TrackAddButton track={item} user={this.props.user} playlistId={this.props.playlistId}/>
                </Track>
              );
            })}
          </div>
        </Search>
      </div>
    );
  }
}

export default SearchContainer;
