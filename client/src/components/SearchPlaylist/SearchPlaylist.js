import React, { Component } from "react";

const SearchPlaylist = props => (
	<div className="card">
		<h4 className="card-header bg-primary text-white">
			Select a playlist
		</h4>
		<form className="card-body" onSubmit={props.handleFormSubmit}>
			<div className="form-row">
				<div className="form-group col-sm-10">
					<input
						name="searchTerm"
						type="text"
						className="form-control"
						onChange={props.handleInputChange}
						value={props.searchTerm}
					/>
				</div>
				<div className="form-group col-sm-2">
					<button type="submit" className="btn btn-primary btn-block">
						Search
					</button>
				</div>
			</div>
		</form>
		<div className="list-group">{props.children}</div>
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
