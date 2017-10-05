import React, { Component } from "react";

const HostSpotifyPlayer = props => (
  <div className="card">
    <h4 className="card-header bg-primary text-white">Current HostSpotifyPlayer</h4>
    {props.children}
  </div>
);

export default HostSpotifyPlayer;
