import React, { Component } from "react";
import styles from "./Track.css";

const Track = props => {
	let divItem = props.track.isPlaying ? (
		<div
			className={
				"list-group-item list-group-item-action "
			}
			style={{ padding: 0 }}
		>
			<div className="row">
				<div className="col-md-9 col-sm-8 col-7">
					<div className="d-flex justify-content-start">
						<div className="p-2">
							<img
								src={
									props.track.albumArtMedUrl ||
									(props.track.album.images
										? props.track.album.images[1].url
										: null)
								}
								width="128px"
							/>
						</div>
						<div className="p-2">
							<div>
								<h2 className="mb-1">{props.track.name}</h2>
							</div>
							<div><h5>
								{props.track.artist ||
									props.track.artists[0].name}{" "}
								{props.track.album.name
									? ` -  ${props.track.album.name}`
									: null}
									</h5>
							</div>
						</div>
					</div>
				</div>
				<div className="col-md-3 col-sm-4 col-5">{props.children}</div>
			</div>
		</div>
	) : (
		<div
			className={
				"list-group-item list-group-item-action " +
				(props.track.hasPlayed ? "disabled" : "")
			}
			style={{ padding: 0 }}
		>
			<div className="row">
				<div className="col-md-9 col-sm-8 col-7">
					<div className="d-flex justify-content-start">
						<div className="p-2">
							<img
								src={
									props.track.albumArtMedUrl ||
									(props.track.album.images
										? props.track.album.images[1].url
										: null)
								}
								width="64px"
							/>
						</div>
						<div className="p-2">
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
					</div>
				</div>
				<div className="col-md-3 col-sm-4 col-5">{props.children}</div>
			</div>
		</div>
	);

	return divItem;
};

export default Track;

// <div className="col-sm-2"><img src={props.track.albumArtMedUrl} width="100px"/></div>
// <div className="col-sm-10">
// 	<h6 key={props.track.id}>
// 		{props.track.name} by {props.track.artist || props.track.artists[0].name}
// 		{props.children}
// 	</h6>
// </div>
