import React, { Component } from "react";
import SpotifyPlaylist from "./SpotifyPlaylist";
import API from "../../utils/API";
import Track from "../Track";

class SpotifyPlaylistContainer extends Component {
  constructor() {
    super();
    this.state = { trackList: [] };
  }

  componentWillMount() {
    //console.log();
    console.log(this.props);
    API.getSpotifyPlaylist(this.props.playlistHref, this.props.user.accessToken)
      .then(res => {
        //console.log(res.data.tracks.items);
        let items = res.data.tracks.items;
        items.forEach(function(item) {
          item.toBeImported = true;
        });
        this.setState({ trackList: items });
        //console.log(items);
      })
      .catch(err => console.log(err));
  }

  componentWillReceiveProps(nextProps) {
    API.getSpotifyPlaylist(nextProps.playlistHref, nextProps.user.accessToken)
      .then(res => {
        //console.log(res.data.tracks.items);
        let items = res.data.tracks.items;
        items.forEach(function(item) {
          item.toBeImported = true;
        });
        this.setState({ trackList: items });
        //console.log(items);
      })
      .catch(err => console.log(err));
  }

  componentDidMount() {}

  onTrackClick = trackId => {
    console.log(trackId);
    this.state.trackList.forEach(function(item) {
      if (item.track.id === trackId) {
        item.toBeImported = !item.toBeImported;
      }
    });
    //console.log(this.state.trackList);
    this.forceUpdate();
  };

  getCheckedTracks = () => {
    let newPlaylist = [];
    const userId = this.props.user._id;
    this.state.trackList.forEach(function(item) {
      if (item.toBeImported) {
        newPlaylist.push({
          name: item.track.name,
          artist: item.track.artists[0].name,
          album: item.track.album.name,
          spotifyId: item.track.id,
          albumArtSmallUrl: item.track.album.images
            ? item.track.album.images[2].url
            : null,
          albumArtMedUrl: item.track.album.images
            ? item.track.album.images[1].url
            : null,
          albumArtLargeUrl: item.track.album.images
            ? item.track.album.images[0].url
            : null,
          addedBy: userId,
          duration: item.track.duration_ms,
          totalVotes: 3
        });
      }
    });
    return newPlaylist;
    //console.log(this.props.user);
  };

  //In future, add ability to re-sort and ability to shuffle

  render() {
    return (
      <div>
        <SpotifyPlaylist />
        <div >
          {this.state.trackList.map(item => {
            return (
              <Track
                track={item.track}
                controlPanelSize={"small"}
                key={item.track.id}
                onClick={() => {
                  this.onTrackClick(item.track.id);
                }}
                shouldBeDisabled={!item.toBeImported}
              >
                {item.toBeImported ? (
                  <i
                    className="fa fa-check-square-o fa-4x text-success"
                    aria-hidden="true"
                  />
                ) : (
                  <i
                    className="fa fa-square-o fa-4x text-danger"
                    aria-hidden="true"
                  />
                )}
              </Track>
            );
          })}
        </div>
      </div>
    );
  }
}

/*
<input
                  name="importCheck"
                  type="checkbox"
                  checked={item.toBeImported}
                  id={item.track.id}
                  onChange={this.handleInputChange}
                />*/

export default SpotifyPlaylistContainer;
