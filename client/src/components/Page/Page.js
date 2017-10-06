import React from "react";
import SearchContainer from "../Search";
import Container from "../Bootstrap/Container";
import PlaylistContainer from "../Playlist";
import Login from "../Login";
import SetupContainer from "../Setup";
import HostSpotifyPlayer from "../HostSpotifyPlayer";
import Header from "../Header";
import SearchPlaylist from "../SearchPlaylist";

/*
		<Container>
			<PlaylistContainer {...props} />
		</Container>
		<Container>
			<SearchContainer {...props} />
		</Container>
*/

const Page = props => (
	<div>
		<Header {...props} />
		{props.user ? (
			props.isHost ? (
				<div>
					{props.playlistId ? (
						<Container>
							<HostSpotifyPlayer {...props} />
						</Container>
					) : (
						<Container>
							<SetupContainer {...props} />
						</Container>
					)}
				</div>
			) : props.playlistId ? (
				<div>
					<Container>
						<PlaylistContainer {...props} />
					</Container>
					<Container>
						<SearchContainer {...props} />
					</Container>
				</div>
			) : (
				<Container>
					<SearchPlaylist {...props} />
				</Container>
			)
		) : (
			<Container>
				<Login {...props} />
			</Container>
		)}
	</div>
);

export default Page;
