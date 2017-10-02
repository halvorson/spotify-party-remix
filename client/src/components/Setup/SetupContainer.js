import React, { Component } from "react";
import Setup from "./Setup";
import SpotifyPlaylistContainer from "../SpotifyPlaylist";
import Container from "../Bootstrap/Container";

class SetupContainer extends Component {
  constructor() {
    super();
    this.state = {
      playlistList: [],
      selectedPlaylistId: null
    };
  }

  componentDidMount() {
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.user) {
      // API.getSpotifyPlaylists(
      //   nextProps.user.spotifyId,
      //   nextProps.user.accessToken
      // )
      //   .then(res => {
      //     console.log(res.data.items);
      //     this.setState({ playlistList: res.data.items });
      //   })
      //   .catch(err => {
      //     console.log(err);
      //     if (err.response.status === 401) {
      //       //Refresh token if needed
      //       this.props.refreshUserToken();
      //     }
      //   });
      console.log("Should be loading playlists, commented out in SetupContainer.js")
    } else {
      //no api call, return loading screen
    }
  }

  selectPlaylist = (id, href) => {
    this.setState({ selectedPlaylistId: id, selectedPlaylistHref: href });
  };

  render() {
    return (
      <div>
        <Setup playlists={null}>
          {this.state.selectedPlaylistId ? (
            <Container>
              <SpotifyPlaylistContainer
                user={this.props.user}
                playlistId={this.state.selectedPlaylistId}
                playlistHref={this.state.selectedPlaylistHref}
              />
            </Container>
          ) : (
            this.state.playlistList.map(item => {
              //console.log(item);
              return (
                <div
                  key={item.id}
                  onClick={() => this.selectPlaylist(item.id, item.href)}
                >
                  <h6 key={item.id}>{item.name}</h6>
                </div>
              );
            })
          )}
        </Setup>
      </div>
    );
  }
}

export default SetupContainer;
