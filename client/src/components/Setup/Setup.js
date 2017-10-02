import React, { Component } from "react";

const Setup = props => (
  <div className="card">
    <h4 className="card-header bg-primary text-white">Current Setup</h4>
    {props.children}
  </div>
);

export default Setup;
