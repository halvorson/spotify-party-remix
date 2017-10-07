import React from "react";
// eslint-disable-next-line
import styles from "./HostControlPanel.css";

const HostControlPanel = props => (
	<div className="d-flex justify-content-end align-items-center">
		<div className="p-2 currentVotes">{props.track.totalVotes}</div>
		<div className="p-2" style={{ padding: "1em", marginRight: "1em" }} />
	</div>
);

export default HostControlPanel;
