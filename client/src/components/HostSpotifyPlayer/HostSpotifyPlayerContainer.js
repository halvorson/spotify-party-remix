import React, { Component } from "react";
import HostSpotifyPlayer from "./HostSpotifyPlayer";
import API from "../../utils/API";
import Track from "../Track";
import HostControlPanel from "../HostControlPanel";

class HostSpotifyPlayerContainer extends Component {
  constructor() {
    super();
    this.state = { trackList: [] };
  }

  componentDidMount() {
    if (this.props.user) {
      //console.log(nextProps);
      this.getPlaylist(this.props);
    } else {
      //no api call, return loading screen
    }
    if (this.props.playlistId) {
      API.subscribeToPlaylistUpdates(this.props.playlistId, (err, refresh) => {
        //console.log("Received update request from socket.io!");
        //console.log(refresh);
        if (refresh === true) {
          this.getPlaylist(this.props);
        }
      });
    }
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.user) {
      //console.log(nextProps);
      this.getPlaylist(nextProps);
    } else {
      //no api call, return loading screen
    }
  }

  getPlaylist = props => {
    API.getDbPlaylist(props.playlistId, props.user._id)
      .then(res => {
        //console.log(res.data.tracks.items);
        //console.log(res);
        this.setState({ trackList: res.data.tracks });
      })
      .catch(err => console.log(err));
  };

  handleFormSubmit = event => {
    event.preventDefault();
  };

  startPlaying = trackNum => {
    API.startPlaying(this.props.user, this.props.playlistId, trackNum);
  };

  playFromTop = () => {
    this.startPlaying(0);
  };

  pickBackUp = () => {
    let playedTracks = 0;
    this.state.trackList.forEach(track => {
      if (track.hasPlayed === true) {
        playedTracks++;
      }
    });
    this.startPlaying(playedTracks);
  };

  forceSync = () => {
    API.syncPlaylist(this.props.playlistId);
  }

  resetPlaylist = () => {
    API.resetPlaylist(this.props.playlistId);
  }

  render() {
    return (
      <div>
        <HostSpotifyPlayer>
          <div className="card-body">
            <div>
              <div className="d-flex justify-content-start">
                <div className="p-2">
                  <button
                    className="btn btn-primary"
                    onClick={this.playFromTop}
                  >
                    Play from top
                  </button>
                </div>
                <div className="p-2">
                  <button className="btn btn-success" onClick={this.pickBackUp}>
                    Pick up where we left off
                  </button>
                </div>
                <div className="p-2">
                  <button
                    className="btn btn-secondary"
                    onClick={this.props.setHostToFalse}
                  >
                    User Mode
                  </button>
                </div>
                <div className="p-2">
                  <button
                    className="btn btn-warning"
                    onClick={this.forceSync}
                  >
                    Force Sync
                  </button>
                </div>
                <div className="p-2">
                  <button
                    className="btn btn-danger"
                    onClick={this.resetPlaylist}
                  >
                    Reset Playlist
                  </button>
                </div>
              </div>
            </div>
            <div className="list-group">
              {this.state.trackList.map(item => {
                return (
                  <Track track={item} key={item._id}>
                    <HostControlPanel
                      track={item}
                      user={this.props.user}
                      playlistId={this.props.playlistId}
                    />
                  </Track>
                );
              })}
            </div>
            Invite friends to contribute at {" "}
            <a
              href={
                window.location.protocol +
                "//" +
                window.location.host +
                "/party/" +
                this.props.playlistId
              }
            >
              {window.location.protocol +
                "//" +
                window.location.host +
                "/party/" +
                this.props.playlistId}
            </a>
          </div>
        </HostSpotifyPlayer>
      </div>
    );
  }
}

export default HostSpotifyPlayerContainer;
