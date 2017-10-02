import React, { Component } from "react";

const Login = props => (
  <div className="card">
    <h4 className="card-header bg-primary text-white">Logged-in User</h4>
    <div>
    	{props.user ? <p>{props.user.name}</p> : null}
    	{props.user ? <p>{props.user.accessToken}</p> : null}
    	<button onClick={props.logout}>Logout</button>
    </div>
  </div>
);

export default Login;
