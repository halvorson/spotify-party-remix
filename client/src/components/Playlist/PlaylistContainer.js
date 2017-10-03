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

  componentDidMount() {}

  componentWillReceiveProps(nextProps) {
    if (nextProps.user) {
      console.log(nextProps);
      this.getPlaylist(nextProps);
    } else {
      //no api call, return loading screen
    }
    if (nextProps.playlistId) {
      API.subscribeToPlaylistUpdates(nextProps.playlistId, (err, refresh) => {
        console.log("Received update request from socket.io!");
        console.log(refresh);
        if (refresh === true) {
          this.getPlaylist(this.props);
        }
      });
    }
  }

  getPlaylist = props => {
    API.getDbPlaylist(props.playlistId, props.user._id)
      .then(res => {
        //console.log(res.data.tracks.items);
        console.log(res);
        this.setState({ trackList: res.data.tracks });
      })
      .catch(err => console.log(err));
  };

  handleFormSubmit = event => {
    event.preventDefault();
  };

  render() {
    return (
      <div>
        <Playlist />
        <div>
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
      </div>
    );
  }
}

export default PlaylistContainer;
