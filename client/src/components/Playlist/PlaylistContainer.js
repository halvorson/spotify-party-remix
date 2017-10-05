import React, { Component } from "react";
import Playlist from "./Playlist";
import API from "../../utils/API";
import Track from "../Track";
import VoteControlPanel from "../VoteControlPanel";

class PlaylistContainer extends Component {
  constructor() {
    super();
    this.state = { trackList: [], timestamp: "no timestamp yet" };
    API.subscribeToTimer(1000, (err, timestamp) =>
      this.setState({
        timestamp
      })
    );
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
        console.log("Received update request from socket.io!");
        console.log(refresh);
        if (refresh === true) {
          this.getPlaylist(this.props);
        }
      });
    }
  }

  componentWillUnmount() {
    API.unsubscribeFromTimer();
    API.unsubscribeFromSocket();
  }

  componentWillReceiveProps(nextProps) {
    console.log(nextProps.user);
    if (nextProps.user) {
      //console.log(nextProps);
      this.getPlaylist(nextProps);
    } else {
      //no api call, return loading screen
    }
    if (nextProps.playlistId) {
      API.subscribeToPlaylistUpdates(nextProps.playlistId, (err, refresh) => {
        console.log("Received update request from socket.io!");
        //console.log(refresh);
        if (refresh === true) {
          this.getPlaylist(this.props);
        }
      });
    }
  }

  getPlaylist = props => {
    //console.log(props.user._id);
    API.getDbPlaylist(props.playlistId, props.user._id)
      .then(res => {
        console.log(res.data.tracks.items);
        console.log(res);
        this.setState({
          trackList: res.data.tracks,
          playlistCreator: res.data.createdBy
        });
      })
      .catch(err => console.log(err));
  };

  handleFormSubmit = event => {
    event.preventDefault();
  };

  render() {
    return (
      <div>
        <Playlist>
          <div className="card-body">
            <div className="list-group">
              {this.state.trackList.map(item => {
                return (
                  <Track track={item} key={item._id}>
                    <VoteControlPanel
                      track={item}
                      user={this.props.user}
                      playlistId={this.props.playlistId}
                    />
                  </Track>
                );
              })}
            </div>
            <div>Time from server is {this.state.timestamp}</div>
            {this.state.playlistCreator === this.props.user._id ? (
              <div>
                <button
                  className="btn btn-secondary"
                  onClick={this.props.setHostToTrue}
                >
                  Host mode
                </button>
              </div>
            ) : null}
          </div>
        </Playlist>
      </div>
    );
  }
}

export default PlaylistContainer;
