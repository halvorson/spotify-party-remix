import React, { Component } from "react";
import styles from './VoteControlPanel.css';

const VoteControlPanel = props => (
	<div className="pull-right voteControlPanel">
		<span className="currentVotes">{props.track.totalVotes}</span>+
		<span className="voteSelector">
			<p onClick={props.increaseVote}>+</p>
			<p >{props.userVotes}</p>
			<p onClick={props.decreaseVote}>-</p>
		</span>
		<span className="vote" onClick={props.submitVote}>
			=>
		</span>
	</div>
);

export default VoteControlPanel;
