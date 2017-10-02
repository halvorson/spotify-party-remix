import React from "react";
import SearchContainer from "../Search";
import Container from "../Bootstrap/Container";
import PlaylistContainer from "../Playlist";
import Login from "../Login";
import SetupContainer from "../Setup";

const Page = props => (
	<div>
		<h1>This is the main App component</h1>
		<Container>
			<Login {...props} />
		</Container>
		<Container>
			<SetupContainer {...props}/> 
		</Container>
		<Container>
			<PlaylistContainer {...props} />
		</Container>
		<Container>
			<SearchContainer {...props} />
		</Container>
	</div>
);

export default Page;
