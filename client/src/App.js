import React, { Component } from "react";
import Page from "./components/Page/";
import "./App.css";
import { BrowserRouter as Router, Route, Link, Switch } from "react-router-dom";

class App extends Component {
	render() {
		return (
			<div className="App">
				<Switch>
					<Route exact path="/party/:playlistId" component={Page} />
					<Route path="/" component={Page} />
				</Switch>
			</div>
		);
	}
}

export default App;
