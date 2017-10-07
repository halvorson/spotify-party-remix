import React from "react";

import PlaylistRow from "../PlaylistRow";
import SpotifyPlaylistContainer from "../SpotifyPlaylist";

const Setup = props => (
	<div className="card">
		<h4 className="card-header bg-primary text-white">
			Create a new playlist
		</h4>
		<div className="card-body">
			<div className="row">
				<div className="col-md-4">
					<h4>Choose a playlist</h4>
					<div
						className="list-group"
						style={{ overflowY: "scroll", height: "400px" }}
					>
						{props.playlistList.map(item => {
							//console.log(item);
							return (
								<PlaylistRow
									playlist={item}
									key={item.id}
									selectedPlaylistId={
										props.selectedPlaylistId
									}
									onClick={() =>
										props.selectPlaylist(
											item.id,
											item.href
										)}
								/>
							);
						})}
					</div>
				</div>

				{props.selectedPlaylistId ? (
					<div className="col-md-8">
						<h4>Select songs to import</h4>
						<div
							style={{
								overflowY: "scroll",
								maxHeight: "400px",
								overflowX: "hidden"
							}}
						>
							<SpotifyPlaylistContainer
								ref={props.setRef}
								user={props.user}
								playlistId={props.selectedPlaylistId}
								playlistHref={props.playlistHref}
							/>
						</div>
					</div>
				) : null}
			</div>
			<div className="row">
				<form className="card-body" onSubmit={props.handleFormSubmit}>
					<div className="form-row">
						<div className="form-group col-sm-12">
							<label>Playlist name:</label>
							<input
								name="name"
								type="text"
								className="form-control"
								onChange={props.handleInputChange}
								value={props.searchTerm}
							/>
						</div>
						<div className="form-group col-sm-12">
							<button
								type="submit"
								className="btn btn-primary btn-block"
							>
								Create playlist
							</button>
						</div>
					</div>
				</form>
			</div>
			<hr />
			<div className="row">
				<div className="col-sm-12">
					<button
						type="submit"
						className="btn btn-secondary btn-block"
						onClick={props.goHome}
					>
						Go back
					</button>
				</div>
			</div>
		</div>
		{props.children}
	</div>
);

export default Setup;
