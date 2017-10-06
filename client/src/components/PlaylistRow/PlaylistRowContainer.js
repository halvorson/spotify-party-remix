import React, { Component } from "react";
import PlaylistRow from "./PlaylistRow";

class PlaylistRowContainer extends Component {
  constructor() {
    super();
    this.state = {};
  }

  componentDidMount() {}

  render() {
    return (
      <PlaylistRow {...this.props}>
        {this.props.children}
      </PlaylistRow>
    );
  }
}

export default PlaylistRowContainer;
