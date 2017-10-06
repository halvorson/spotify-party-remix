import React, { Component } from "react";
import Track from "./Track";

class TrackContainer extends Component {
  constructor() {
    super();
    this.state = {};
  }

  componentDidMount() {}

  render() {
    //console.log(this.props.track);
    return (
      <Track
        track={this.props.track}
        controlPanelSize={this.props.controlPanelSize}
        onClick={this.props.onClick}
      >
        {this.props.children}
      </Track>
    );
  }
}

export default TrackContainer;
