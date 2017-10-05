import React, { Component } from "react";
import Setup from "./Setup";
import SpotifyPlaylistContainer from "../SpotifyPlaylist";
import Container from "../Bootstrap/Container";
import API from "../../utils/API";
import PlaylistRow from "../PlaylistRow";

class SetupContainer extends Component {
  constructor() {
    super();
    this.state = {
      playlistList: [],
      selectedPlaylistId: null
    };
  }

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
          if (err.response.status === 401) {
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
    console.log(this.props);
    console.log(this.refs.spotifyPlaylist.getCheckedTracks());
    const newPlaylist = this.refs.spotifyPlaylist.getCheckedTracks();
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
      <div>
        <Setup playlists={null}>
          <Container>
            <div className="row">
              <div className="col-md-4">
                <h4>Choose a playlist</h4>
                <div className="pre-scrollable">
                  {this.state.playlistList.map(item => {
                    //console.log(item);
                    return (
                      <PlaylistRow
                        playlist={item}
                        key={item.id}
                        onClick={() => this.selectPlaylist(item.id, item.href)}
                      />
                    );
                  })}
                </div>
              </div>

              {this.state.selectedPlaylistId ? (
                <div className="col-md-8">
                  <h4>Select songs to import</h4>
                  <div className="pre-scrollable">
                    <SpotifyPlaylistContainer
                      ref="spotifyPlaylist"
                      user={this.props.user}
                      playlistId={this.state.selectedPlaylistId}
                      playlistHref={this.state.selectedPlaylistHref}
                    />
                  </div>
                </div>
              ) : null}
            </div>
            <div className="row">
              <form className="card-body" onSubmit={this.handleFormSubmit}>
                <div className="form-row">
                  <div className="form-group col-sm-12">
                    <label>Playlist name:</label>
                    <input
                      name="name"
                      type="text"
                      className="form-control"
                      onChange={this.handleInputChange}
                      value={this.state.searchTerm}
                    />
                  </div>
                  <div className="form-group col-sm-12">
                    <button type="submit" className="btn btn-primary btn-block">
                      Create playlist
                    </button>
                  </div>
                </div>
              </form>
            </div>
            <hr />
            <div className="form-group col-sm-12">
              <button
                type="submit"
                className="btn btn-secondary btn-block"
                onClick={this.props.goHome}
              >
                Go back
              </button>
            </div>
          </Container>
        </Setup>
      </div>
    );
  }
}

export default SetupContainer;
