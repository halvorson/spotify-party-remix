import React, { Component } from "react";
import PlaylistRow from "./PlaylistRow";

class PlaylistRowContainer extends Component {
  constructor() {
    super();
    this.state = {};
  }

  componentDidMount() {}

  render() {
    //console.log(this.props.track);
    return (
      <PlaylistRow {...this.props}>
        {this.props.children}
      </PlaylistRow>
    );
  }
}

export default PlaylistRowContainer;
