import React, { Component } from "react";
import Playlist from "./Playlist";
import API from "../../utils/API";

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
        <Playlist
          trackList={this.state.trackList}
          user={this.props.user}
          playlistId={this.props.playlistId}
          playlistCreator={this.state.playlistCreator}
          setHostToTrue={this.props.setHostToTrue}
          timestamp={this.state.timestamp}
        >
          
        </Playlist>
      </div>
    );
  }
}

export default PlaylistContainer;
