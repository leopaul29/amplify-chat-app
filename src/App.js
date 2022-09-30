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

async function listMessages(setMessages) {
	const messages = await DataStore.query(Messages, Predicates.ALL);
	setMessages(messages);
}

function App() {
	const [rooms, setRooms] = useState([]);
	const [messages, setMessages] = useState([]);

	useEffect(() => {
		listRooms(setRooms);

		const subscription = DataStore.observe(Rooms).subscribe((msg) => {
			console.log("model", msg.model, msg.opType, msg.element);
			listRooms(setRooms);
		});

		return () => subscription.unsubscribe();
	}, []);

	useEffect(() => {
		listMessages(setMessages);

		const subscription = DataStore.observe(Messages).subscribe((msg) => {
			console.log("model", msg.model, msg.opType, msg.element);
			listMessages(setMessages);
		});

		return () => subscription.unsubscribe();
	}, []);
	return (
		<div className="App">
			<h1>Hello World</h1>
			<nav>
				<ul>
					{rooms.map((room) => {
						return <li key={room.id}>{room.roomname}</li>;
					})}
				</ul>
			</nav>
			<main>
				<ol>
					{messages.map((message) => {
						return <li key={message.id}>{message.message}</li>;
					})}
				</ol>
			</main>
		</div>
	);
}

export default App;
