import React, { Component } from "react";
import Page from "./Page";
import API from "../../utils/API";
import axios from "axios";

class PageContainer extends Component {
  constructor() {
    super();
    this.state = {
      loggedIn: false,
      user: {},
      playlistId: "59cf42616097915eb8d61e32"
    };
  }

  componentWillMount() {
    console.log("Trying to get user");
    API.getUser()
      .then(user => {
        this.setState({
          loggedIn: true,
          user: user
        });
      })
      .catch(err => {
        this.setState({
          loggedIn: false,
          user: null
        });
        console.log(err);
      });
  }

  componentDidMount() {}

  refreshUserToken = () => {
    API.refreshUserToken().then(refreshedUser => {
      this.setState({ loggedIn: true, user: refreshedUser });
    });
  };

  logout = event => {
    event.preventDefault();
    console.log("logging out");
    axios.post("/auth/logout").then(response => {
      console.log(response.data);
      if (response.status === 200) {
        this.setState({
          loggedIn: false,
          user: null
        });
      }
    });
  };

  setPlaylistId = playlistId => {
    this.setState({playlistId: playlistId})
  }



  render() {
    return (
      <Page
        user={this.state.user}
        loggedIn={this.state.loggedIn}
        logout={this.logout}
        refreshUserToken={this.refreshUserToken}
        playlistId={this.state.playlistId}
        setPlaylistId={this.state.setPlaylistId}
      />
    );
  }
}

export default PageContainer;
