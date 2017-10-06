import React, { Component } from "react";
import Setup from "./Setup";
import Container from "../Bootstrap/Container";
import API from "../../utils/API";

class SetupContainer extends Component {
  constructor() {
    super();
    this.state = {
      playlistList: [],
      selectedPlaylistId: null
    };

  }

  //let spotifyPlaylist = null;

  componentDidMount() {
    if (this.props.user) {
      API.getSpotifyPlaylists(
        this.props.user.spotifyId,
        this.props.user.accessToken
      )
        .then(res => {
          console.log(res.data.items);
          this.setState({ playlistList: res.data.items });
        })
        .catch(err => {
          console.log(err);
          if (err.response === 401) {
            //Refresh token if needed
            this.props.refreshUserToken();
          }
        });
    }
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.user) {
      API.getSpotifyPlaylists(
        nextProps.user.spotifyId,
        nextProps.user.accessToken
      )
        .then(res => {
          //console.log(res.data.items);
          this.setState({ playlistList: res.data.items });
        })
        .catch(err => {
          //console.log(err);
          if (err.response.status === 401) {
            //Refresh token if needed
            this.props.refreshUserToken();
          }
        });
      // console.log("Should be loading playlists, commented out in SetupContainer.js")
    } else {
      //no api call, return loading screen
    }
  }

  selectPlaylist = (id, href) => {
    this.setState({ selectedPlaylistId: id, selectedPlaylistHref: href });
    console.log(id);
    console.log(href);
    console.log("Click registered");
  };

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

  handleFormSubmit = e => {
    //Form submits new playlist
    e.preventDefault();
    //console.log(this.props);
    //console.log(this.spotifyPlaylist.getCheckedTracks());
    const newPlaylist = this.spotifyPlaylist.getCheckedTracks();
    API.createPlaylist(
      newPlaylist,
      this.props.user.spotifyId,
      this.props.user.accessToken,
      this.state.name,
      "Michael's house",
      this.props.user._id
    ).then(res => {
      this.props.setPlaylistId(res.data.SPRId);
      console.log(res);
      //this.setState({ savedPlaylistId: res.SPRId });
    });
  };

  

  render() {
    return (
      
        <Setup playlists={null}
          selectedPlaylistId={this.state.selectedPlaylistId}
          selectPlaylist={this.selectPlaylist}
          user={this.props.user}
          playlistHref={this.state.selectedPlaylistHref}
          handleFormSubmit = {this.handleFormSubmit}
          handleInputChange = {this.handleInputChange}
          goHome={this.props.goHome}
          searchTerm={this.state.searchTerm}
          playlistList={this.state.playlistList}
          setRef = {(item) => {this.spotifyPlaylist = item}}
          >
          
        </Setup>
      
    );
  }
}

export default SetupContainer;
