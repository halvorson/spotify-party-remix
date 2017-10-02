import React, { Component } from "react";
import Login from "./Login";

class LoginContainer extends Component {
  constructor() {
    super();
    this.state = { trackList: [] };
  }

  componentDidMount() {}

  render() {
    return (
      <div>
        <Login user={this.props.user} logout={this.props.logout} />
      </div>
    );
  }
}

export default LoginContainer;
