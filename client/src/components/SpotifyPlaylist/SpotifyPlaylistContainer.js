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

  componentDidMount() {}

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

  handleInputChange = event => {
    //event.preventDefault();
    //console.log(event.target);
    //console.log(event.target.id);
    //let newTrackList = [];
    this.state.trackList.forEach(function(item) {
      //console.log(item);
      if (item.track.id === event.target.id) {
        item.toBeImported = !item.toBeImported;
      }
      //newTrackList.push(item);
    });
    console.log(this.state.trackList);
    //console.log(newTrackList);
    this.forceUpdate();
    //this.setState({ trackList: newTrackList });
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
          albumArtSmallUrl: item.track.album.images[2].url,
          albumArtMedUrl: item.track.album.images[1].url,
          albumArtLargeUrl: item.track.album.images[0].url,
          addedBy: userId,
          duration: item.track.duration_ms
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
        <div>
          {this.state.trackList.map(item => {
            return (
              <Track track={item.track} key={item.track.id}>
                <input
                  name="importCheck"
                  type="checkbox"
                  checked={item.toBeImported}
                  id={item.track.id}
                  onChange={this.handleInputChange}
                />
              </Track>
            );
          })}
        </div>
      </div>
    );
  }
}

export default SpotifyPlaylistContainer;
