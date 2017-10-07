import React from "react";
import PlaylistRow from "../PlaylistRow";

const SearchPlaylist = props => (
	<div className="card">
		<div className="card-header bg-primary text-white align-middle d-flex justify-content-start p-2">
			<div className="p-2">
				<h4>Select a playlist</h4>
			</div>
			<div className="p-2 ml-auto">
				{true ? (
					<button
						className="btn btn-sm btn-info"
						onClick={props.createNewPlaylist}
					>
						Start your own party
					</button>
				) : null}
			</div>
		</div>
		<div className="card-body">
			<div className="form-row d-flex p-2 justify-content-start flex-wrap">
				<div className="p-2 col">
					<input
						style={{ minWidth: "200px", width: "100%" }}
						name="searchTerm"
						type="text"
						className="form-control"
						onChange={props.handleInputChange}
						value={props.searchTerm}
					/>
				</div>
				<div className="p-2">
					<button
						type="submit"
						className="btn btn-secondary btn-block"
						onClick={props.handleSearchClick}
					>
						Search
					</button>
				</div>
				<div className="p-2 align-middle">
					<span className="align-middle">or</span>
				</div>

				<div className="p-2">
					<button
						className="btn btn-primary btn-block"
						onClick={props.getAllPlaylists}
					>
						Select from list
					</button>
				</div>
			</div>

			<div className="list-group">
				{props.searchResults.map(item => {
					return (
						<PlaylistRow
							playlist={item}
							key={item._id}
							onClick={props.selectDbPlaylist}
						/>
					);
				})}
			</div>
			<div className="list-group">
				{props.listResults.map(item => {
					return (
						<PlaylistRow
							playlist={item}
							key={item._id}
							onClick={props.selectDbPlaylist}
						/>
					);
				})}
			</div>
		</div>
	</div>
);

/*
			<div className="form-row">
				<div className="col-sm-10">
					<label className="radio-inline">
						<input
							type="radio"
							name="searchType"
							onChange={props.handleInputChange}
							checked={props.searchType === "name"}
							value="name"
						/>Playlist Name
					</label>
					<span className="text-center">
						<label className="radio-inline text-center">
							<input
								type="radio"
								name="searchType"
								onChange={props.handleInputChange}
								checked={props.searchType === "creator"}
								value="creator"
							/>Playlist Creator
						</label>
					</span>
					<label className="radio-inline pull-right">
						<input
							type="radio"
							name="searchType"
							onChange={props.handleInputChange}
							checked={props.searchType === "proximate"}
							value="proximate"
						/>Closest to me
					</label>
				</div>
			</div>
			*/

export default SearchPlaylist;
