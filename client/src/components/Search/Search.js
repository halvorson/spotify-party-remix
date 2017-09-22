import React, { Component } from "react";

const Search = props => (
	<div className="card">
		<h4 className="card-header bg-primary text-white">Search</h4>
		<form className="card-body" onSubmit={props.handleFormSubmit}>
			<div className="form-row">
				<div className="form-group col-sm-10">
					<input
						name="searchTerm"
						type="text"
						className="form-control"
						onChange={props.handleInputChange}
						id="formGroupExampleInput"
						placeholder="Search Query"
					/>
				</div>
				<div className="form-group col-sm-2">
					<button type="submit" className="btn btn-primary btn-block">
						Search
					</button>
				</div>
			</div>
			<div className="form-row">
				<div className="col form-group">
					<label className="form-control-label" htmlFor="startYear">
						From:
					</label>
					<input
						name="startYear"
						type="number"
						onChange={props.handleInputChange}
						className="form-control"
						placeholder="Start Year"
					/>
				</div>
				<div className="col form-group">
					<label className="form-control-label" htmlFor="endYear">
						To:
					</label>
					<input
						name="endYear"
						type="number"
						onChange={props.handleInputChange}
						className="form-control"
						placeholder="End Year"
					/>
				</div>
			</div>
		</form>
	</div>
);

export default Search;
