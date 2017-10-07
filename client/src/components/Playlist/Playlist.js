import React from "react";
import Track from "../Track";
import VoteControlPanel from "../VoteControlPanel";

const Playlist = props => (
	<div className="card">
		<div className="card-header bg-primary text-white align-middle d-flex justify-content-start p-2">
			<div className="p-2">
				<h4>Current Playlist</h4>
			</div>
			<div className="p-2 ml-auto">
				{props.playlistCreator === props.user._id ? (
					<button
						className="btn btn-sm btn-info"
						onClick={props.setHostToTrue}
					>
						Host mode
					</button>
				) : null}
			</div>
		</div>
		<div className="card-body">
			<div className="list-group">
				{props.trackList.map(item => {
					return (
						<Track track={item} key={item._id}>
							<VoteControlPanel
								track={item}
								user={props.user}
								playlistId={props.playlistId}
							/>
						</Track>
					);
				})}
			</div>
			//<div>Time from server is {props.timestamp}</div>
		</div>
		{props.children}
	</div>
);

export default Playlist;
