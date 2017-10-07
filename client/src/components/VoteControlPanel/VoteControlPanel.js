import React from "react";
// eslint-disable-next-line
import styles from "./VoteControlPanel.css";

const VoteControlPanel = props => (
	<div className="d-flex justify-content-end align-items-center">
		{props.track.isPlaying || props.track.hasPlayed ? null : (
			<div
				className={
					"p-2 voteControl " + (props.hasVotedDown ? "disabled" : "")
				}
				onClick={props.hasVotedDown ? null : props.decreaseVote}
			>
				<i className="fa fa-minus-circle" aria-hidden="true" />
			</div>
		)}
		<div className="p-2 currentVotes">{props.track.totalVotes}</div>
		{props.track.isPlaying || props.track.hasPlayed ? (
			<div
				className="p-2"
				style={{ padding: "1em", marginRight: "1em" }}
			/>
		) : (
			<div
				className={
					"p-2 voteControl " + (props.hasVotedUp ? "disabled" : "")
				}
				onClick={props.hasVotedUp ? null : props.increaseVote}
			>
				<i className="fa fa-plus-circle" aria-hidden="true" />
			</div>
		)}
	</div>
);

/*
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

<div className="p-2 currentVotes">{props.track.totalVotes}</div>
					<div className="p-2">+</div>
					<div className="p-2">
						<div className="voteControl" onClick={props.increaseVote}><i className="fa fa-plus-circle" aria-hidden="true"></i></div>
						<div className="userVotes">{props.userVotes}</div>
						<div className="voteControl" onClick={props.decreaseVote}><i className="fa fa-minus-circle" aria-hidden="true"></i></div>
					</div>
					<div className="p-2 voteButton" onClick={props.submitVote}>
						<i className="fa fa-arrow-circle-right" aria-hidden="true"></i>
					</div>

	*/

export default VoteControlPanel;
