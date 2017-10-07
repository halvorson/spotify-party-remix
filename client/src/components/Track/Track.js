import React, { Component } from "react";
import styles from "./Track.css";

const Track = props => (
	<div
		className={
			"list-group-item list-group-item-action " +
			(props.track.isPlaying
				? "active"
				: (props.track.hasPlayed || props.track.shouldBeDisabled) ? "disabled" : "")
		}
		style={{ padding: 0 }}
		onClick={props.onClick}
	>
		<div className="row">
			<div
				className={
					props.controlPanelSize === "small"
						? "col-md-10 col-sm-10 col-10"
						: "col-md-9 col-sm-8 col-7"
				}
			>
				<div className="d-flex justify-content-start">
					<div className="p-2">
						<img
							src={
								props.track.albumArtMedUrl ||
								(props.track.album.images
									? props.track.album.images[1].url
									: null)
							}
							width={props.track.isPlaying ? "128px" : "64px"}
						/>
					</div>
					<div className="p-2">
						{props.track.isPlaying ? (
							<div>
								<div>
									<h2 className="mb-1">{props.track.name}</h2>
								</div>
								<div>
									<h5>
										{props.track.artist ||
											props.track.artists[0].name}{" "}
										{props.track.album.name
											? ` -  ${props.track.album.name}`
											: null}
									</h5>
								</div>
							</div>
						) : (
							<div>
								<div>
									<h5 className="mb-1">{props.track.name}</h5>
								</div>

								<div>
									{props.track.artist ||
										props.track.artists[0].name}{" "}
									{props.track.album.name
										? ` -  ${props.track.album.name}`
										: null}
								</div>
							</div>
						)}
					</div>
				</div>
			</div>
			<div
				className={
					props.controlPanelSize === "small"
						? "col-md-2 col-sm-2 col-2"
						: "col-md-3 col-sm-4 col-5"
				}
			>
				{props.children}
			</div>
		</div>
	</div>
);

export default Track;

// <div className="col-sm-2"><img src={props.track.albumArtMedUrl} width="100px"/></div>
// <div className="col-sm-10">
// 	<h6 key={props.track.id}>
// 		{props.track.name} by {props.track.artist || props.track.artists[0].name}
// 		{props.children}
// 	</h6>
// </div>
