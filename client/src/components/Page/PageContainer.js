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
      playlistId: null,
      isHost: false
    };
  }

  componentWillMount() {
    console.log("Trying to get user");
    API.getUser()
      .then(user => {
        console.log("Got user, refreshing token...");
        this.refreshUserToken();
        this.state.refreshIntervalId = setInterval(this.refreshUserToken(), 3300000);
      })
      .catch(err => {
        this.setState({
          loggedIn: false,
          user: null
        });
        //console.log(err);
      });
  }

  componentWillUnmount() {
    clearInterval(this.state.refreshIntervalId);
  }

  componentDidMount() {
    //this.setState({ isHost: false, playlistId: "59d507a084c9d07fcdc86544" });
    console.log(window.location.href);
    let urlPieces = window.location.href.split("/");
    const lastPartOfUrl = urlPieces.pop();
    const penultimatePartOfUrl = urlPieces.pop();
    if(penultimatePartOfUrl === "party" && lastPartOfUrl.length === 24) {
      this.setState ({playlistId: lastPartOfUrl});
    };
  }

  refreshUserToken = () => {
    //console.log("Old access token: " + this.state.user.accessToken)
    API.refreshUserToken().then(refreshedUser => {
      console.log("Got refreshed token!");
      this.setState({ loggedIn: true, user: refreshedUser.data.user });
      //console.log("New access token: " + this.state.user.accessToken)
    });
  };

  logout = event => {
    event.preventDefault();
    console.log("logging out");
    axios.post("/auth/logout").then(response => {
      //console.log(response.data);
      if (response.status === 200) {
        this.setState({
          loggedIn: false,
          user: null
        });
      }
    });
  };

  setHostToTrue = () => {
    this.setState({ isHost: true });
  };

  setHostToFalse = () => {
    this.setState({ isHost: false });
  };

  setPlaylistId = playlistId => {
    this.setState({ playlistId: playlistId });
  };

  createNewPlaylist = () => {
    console.log("Create new playlist triggered");
    this.setState({ isHost: true, playlistId: null });
  };

  stateDidChange = () => {
    //console.log(this.state);
  };

  goHome = () => {
    this.setState({ playlistId: null, isHost: false });
  };

  render() {
    return (
      <Page
        user={this.state.user}
        loggedIn={this.state.loggedIn}
        logout={this.logout}
        refreshUserToken={this.refreshUserToken}
        playlistId={this.state.playlistId}
        setPlaylistId={this.setPlaylistId}
        isHost={this.state.isHost}
        createNewPlaylist={this.createNewPlaylist}
        goHome={this.goHome}
        setHostToFalse={this.setHostToFalse}
        setHostToTrue={this.setHostToTrue}
      />
    );
  }
}

export default PageContainer;
