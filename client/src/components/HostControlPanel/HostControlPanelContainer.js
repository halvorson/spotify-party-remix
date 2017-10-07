import React, { Component } from "react";
import HostControlPanel from "./HostControlPanel";

class HostControlPanelContainer extends Component {
  constructor() {
    super();
    this.state = {};
  }

  componentDidMount() {}

  startPlaying = () => {
    const startPlayingObj = {
      requestorSpotifyId: this.props.user.spotifyId,
      playlistId: this.props.playlistId,
      trackNum: this.props.track.order
    }
    console.log(startPlayingObj);
    //API.startPlaying(this.props.user, this.props.playlistId, this.props.track.order)
  }


  render() {
    //console.log(this.props.track);
    return (
      <HostControlPanel
        track={this.props.track}
        startPlaying = {this.startPlaying}
      >
        <i />
      </HostControlPanel>
    );
  }
}

export default HostControlPanelContainer;
