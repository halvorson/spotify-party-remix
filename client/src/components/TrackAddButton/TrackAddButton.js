import React from "react";

const TrackAddButton = props => (
	<div className="d-flex justify-content-end align-items-center" style={{height: "100%"}}>
		<div className="p-2">
			<button className="pull-right btn btn-primary align-middle" {...props}>
				Add!
			</button>
		</div>
	</div>
);

export default TrackAddButton;
