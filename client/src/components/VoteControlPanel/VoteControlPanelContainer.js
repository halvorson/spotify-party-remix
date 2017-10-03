import React, { Component } from "react";
import VoteControlPanel from "./VoteControlPanel";
import API from "../../utils/API";

class VoteControlPanelContainer extends Component {
  constructor() {
    super();
    this.state = { userVotes: 0 };
  }

  componentDidMount() {}

  submitVote = () => {
    const userId = this.props.user._id;
    const trackId = this.props.track._id;
    const userVotes = this.state.userVotes;
    const playlistId = this.props.playlistId;
    console.log(this.props);
    API.voteForTrack(trackId, userId, userVotes, playlistId);
    this.setState({ userVotes: 0 });
  };

  increaseVote = () => {
    if (this.allowVotes()) {
      const newVoteTally = this.state.userVotes + 1;
      this.setState({ userVotes: newVoteTally });
    }
  };

  allowVotes = () => {
    return true;
  };

  decreaseVote = () => {
    if (this.allowVotes()) {
      const newVoteTally = this.state.userVotes - 1;
      this.setState({ userVotes: newVoteTally });
    }
  };

  getCurrentUserVote = () => {};

  render() {
    //console.log(this.props.track);
    return (
      <VoteControlPanel
        track={this.props.track}
        userVotes={this.state.userVotes}
        increaseVote={this.increaseVote}
        decreaseVote={this.decreaseVote}
        submitVote={this.submitVote}
      >
        <i />
      </VoteControlPanel>
    );
  }
}

export default VoteControlPanelContainer;
