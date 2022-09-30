import { useEffect, useState } from "react";
import "./App.css";
import { DataStore, Predicates } from "@aws-amplify/datastore";
import { Messages, Rooms, Users } from "./models";

import awsConfig from "./aws-exports";

import Amplify from "@aws-amplify/core";
Amplify.configure(awsConfig);

async function listRooms(setRooms) {
	const rooms = await DataStore.query(Rooms, Predicates.ALL);
	setRooms(rooms);
}

function App() {
	const [rooms, setRooms] = useState([]);
	useEffect(() => {
		listRooms(setRooms);

		const subscription = DataStore.observe(Rooms).subscribe((msg) => {
			console.log("model", msg.model, msg.opType, msg.element);
			listRooms(setRooms);
		});

		return () => subscription.unsubscribe();
	}, []);

	/*async function getRooms() {
		const rooms = await DataStore.query(Rooms);
		console.log("rooms", rooms);
		const messages = await DataStore.query(Messages);
		console.log("messages", messages);
		const users = await DataStore.query(Users);
		console.log("users", users);
	}
	getRooms();*/
	return (
		<div className="App">
			<h1>Hello World</h1>
			{rooms.map((room) => {
				return <div key={room.id}>{room.roomname}</div>;
			})}
		</div>
	);
}

export default App;
