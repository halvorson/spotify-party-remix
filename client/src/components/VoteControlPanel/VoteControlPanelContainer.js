import React, { Component } from "react";
import VoteControlPanel from "./VoteControlPanel";
import API from "../../utils/API";

class VoteControlPanelContainer extends Component {
  constructor() {
    super();
    this.state = { userVotes: 0, hasVotedUp: false, hasVotedDown: false };
  }

  componentDidMount() {}

  submitVote = (vote) => {
    const userId = this.props.user._id;
    const trackId = this.props.track._id;
    const playlistId = this.props.playlistId;
    console.log(this.props);
    API.voteForTrack(trackId, userId, vote, playlistId);
    //this.setState({ userVotes: 0 });
  };

  increaseVote = () => {
    console.log("voting up");
    if (this.allowVotes(1)) {
      const newVoteTally = this.state.userVotes + 1;
      this.setState({ userVotes: newVoteTally });
      this.submitVote(1);
      if (newVoteTally === 1) {
        this.setState({ hasVotedUp: true, hasVotedDown: false });
      } else if (newVoteTally === 0) {
        this.setState({ hasVotedUp: false, hasVotedDown: false });
      }
    }
  };

  allowVotes = () => {
    return true;
  };

  decreaseVote = () => {
    if (this.allowVotes(-1)) {
      const newVoteTally = this.state.userVotes - 1;
      this.setState({ userVotes: newVoteTally });
      this.submitVote(-1);
      if (newVoteTally === -1) {
        this.setState({ hasVotedUp: false, hasVotedDown: true });
      } else if (newVoteTally === 0) {
        this.setState({ hasVotedUp: false, hasVotedDown: false });
      }
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
        hasVotedDown={this.state.hasVotedDown}
        hasVotedUp={this.state.hasVotedUp}
      >
        <i />
      </VoteControlPanel>
    );
  }
}

export default VoteControlPanelContainer;
