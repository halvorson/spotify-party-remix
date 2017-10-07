import React from "react";

const Search = props => (
	<div className="card">
		<h4 className="card-header bg-primary text-white">Add new track</h4>
		<form className="card-body" onSubmit={props.handleFormSubmit}>
			<div className="form-row">
				<div className="form-group col-sm-10">
					<input
						name="searchTerm"
						type="text"
						className="form-control"
						onChange={props.handleInputChange}
						id="formGroupExampleInput"
						placeholder="Spotify Track Search"
					/>
				</div>
				<div className="form-group col-sm-2">
					<button type="submit" className="btn btn-primary btn-block">
						Search
					</button>
				</div>
			</div>
		</form>
		<div className="container">{props.children}</div>
	</div>
);

export default Search;
