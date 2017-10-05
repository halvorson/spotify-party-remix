import React, { Component } from "react";
import TrackAddButton from "./TrackAddButton";
import API from "../../utils/API";

class TrackAddButtonContainer extends Component {
  constructor() {
    super();
    this.state = {};
  }

  componentDidMount() {}

  addTrack = () => {
    const albumArtSmallUrl = {};
    const track = {
      name: this.props.track.name,
      artist: this.props.track.artists[0].name,
      album: this.props.track.album.name,
      spotifyId: this.props.track.id,
      albumArtSmallUrl: (this.props.track.album.images ? this.props.track.album.images[2].url : null),
      albumArtMedUrl: (this.props.track.album.images ? this.props.track.album.images[1].url : null),
      albumArtLargeUrl: (this.props.track.album.images ? this.props.track.album.images[0].url : null),
      addedBy: this.props.user._id,
      duration: this.props.track.duration_ms
    };
    console.log("addTrack button pressed");
    API.addTrackToPlaylist(track, this.props.playlistId);
  }

  render() {
    //console.log(this.props.track);
    return (
      <TrackAddButton onClick={this.addTrack} />
    );
  }
}

export default TrackAddButtonContainer;
