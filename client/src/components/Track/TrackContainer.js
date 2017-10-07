import React, { Component } from "react";
import Track from "./Track";

class TrackContainer extends Component {
  constructor() {
    super();
    this.state = { progressAmount: 37, progressInterval: null };
  }

  componentDidMount() {
    const interval = setInterval(this.updateProgress, 100);
    if (this.state.progressInterval) {
      clearInterval(this.state.progressInterval);
    }
    this.setState({ progressInterval: interval });
  }

  componentWillUnmount() {
    if (this.state.progressInterval) {
      clearInterval(this.state.progressInterval);
    }
  }

  componentWillReceiveProps(nextProps) {
    // if (nextProps.isPlaying) {
    //
    //   setInterval(
    //     this.incrementProgress,
    //     this.props.track.duration / 100
    //   );
    //
    //   let d = new Date();
    //   let n = d.getTime();
    //   const startingProgress =
    //     (n - this.props.track.playedAt) / this.props.track.duration;
    //   this.setState({progressAmount: startingProgress});
    // }
  }

  updateProgress = () => {
    let d = new Date();
    let n = d.getTime();
    const progress =
      (n - this.props.track.playedAt) / this.props.track.duration * 100;
    this.setState({ progressAmount: progress });
  };

  render() {
    //console.log(this.props.track);
    return (
      <Track
        track={this.props.track}
        controlPanelSize={this.props.controlPanelSize}
        onClick={this.props.onClick}
        progressAmount={this.state.progressAmount}
      >
        {this.props.children}
      </Track>
    );
  }
}

export default TrackContainer;
