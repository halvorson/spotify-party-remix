import React, { Component } from "react";
import Playlist from "./Playlist";
import API from "../../utils/API";
import Track from "../Track";
import VoteControlPanel from "../VoteControlPanel";

class PlaylistContainer extends Component {
  constructor() {
    super();
    this.state = { trackList: [] };
  }

  componentDidMount() {}

  componentWillReceiveProps(nextProps) {
    if (nextProps.user && nextProps.user.accessToken) {
      API.getDbPlaylist(nextProps.playlistId, nextProps.user._id)
        .then(res => {
          //console.log(res.data.tracks.items);
          console.log(res.data.tracks);
          this.setState({ trackList: res.data.tracks });
        })
        .catch(err => console.log(err));
    } else {
      //no api call, return loading screen
    }
  }

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
                <VoteControlPanel track={item} user={this.props.user}/>
              </Track>
            );
          })}
        </div>
      </div>
    );
  }
}

export default PlaylistContainer;
