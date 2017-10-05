import React, { Component } from "react";

const Setup = props => (
  <div className="card">
    <h4 className="card-header bg-primary text-white">Create a new playlist</h4>
    {props.children}
  </div>
);

export default Setup;
