import React from "react";

const HostSpotifyPlayer = props => (
  <div className="card">
    <h4 className="card-header bg-primary text-white">Party Host Control Panel</h4>
    {props.children}
  </div>
);

export default HostSpotifyPlayer;
