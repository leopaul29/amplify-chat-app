import React, { useEffect, useState } from "react";
import "./App.css";
import { DataStore, Predicates } from "@aws-amplify/datastore";
import { Rooms } from "./models";

async function listRooms(setRooms) {
	const rooms = await DataStore.query(Rooms, Predicates.ALL);
	setRooms(rooms);
}

function NavRoom() {
	const [rooms, setRooms] = useState([]);

	useEffect(() => {
		listRooms(setRooms);

		const subscription = DataStore.observe(Rooms).subscribe((msg) => {
			console.log("model", msg.model, msg.opType, msg.element);
			listRooms(setRooms);
		});

		return () => subscription.unsubscribe();
	}, []);

	function changeRoom(roomId) {
		//setState(...state, { roomId: roomId });
	}

	return (
		<nav>
			<ul>
				{rooms.map((room) => {
					return (
						<li key={room.id} onClick={() => changeRoom(room.id)}>
							{room.roomname}
						</li>
					);
				})}
			</ul>
		</nav>
	);
}

export default NavRoom;
