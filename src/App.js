import React, { useState, useEffect } from "react";
import "./App.css";
import awsConfig from "./aws-exports";

import Amplify from "@aws-amplify/core";

import { DataStore, Predicates, SortDirection } from "@aws-amplify/datastore";
import { Rooms, Messages, Users } from "./models";

Amplify.configure(awsConfig);

async function listRooms(setRooms) {
	const rooms = await DataStore.query(Rooms, Predicates.ALL);
	setRooms(rooms);
}

async function onCreate(messageText, roomId) {
	await DataStore.save(
		new Messages({
			message: messageText,
			usersID: "37f0749a-38f7-4843-b082-6f1387904ffe",
			messagesRoomsId: roomId,
		})
	);
}

function App() {
	const [state, setState] = useState({ roomId: "", userId: "" });
	const [rooms, setRooms] = useState([]);
	const [messages, setMessages] = useState([]);
	const [inputText, setInputText] = useState("");
	const [users, setUsers] = useState([]);

	// useEffect init
	useEffect(() => {
		listRooms(setRooms);

		if (rooms.length > 0) state.roomId = rooms[0].id;

		const subscription = DataStore.observe(Rooms).subscribe((msg) => {
			console.log("model", msg.model, msg.opType, msg.element);
			listRooms(setRooms);
		});

		return () => subscription.unsubscribe();
	}, []);

	useEffect(() => {
		const sub = DataStore.observeQuery(
			Messages,
			(c) => c.messagesRoomsId("eq", state.roomId),
			{
				sort: (s) => s.createdAt(SortDirection.ASCENDING),
			}
		).subscribe(({ items }) => {
			setMessages(items);
		});

		return () => sub.unsubscribe();
	}, [state.roomId]);

	useEffect(() => {
		const sub = DataStore.observeQuery(Messages, Predicates.ALL).subscribe(
			({ items }) => {
				console.log("items", items);
				console.log(
					"items.map((item) => item.userId",
					items.map((item) => item.usersID)
				);
				setUsers([
					...new Set(
						items.map((item) => {
							return item.usersID;
						})
					),
				]);
			}
		);

		return () => sub.unsubscribe();
	}, [state.roomId]);

	// send function
	const sendMessage = (event) => {
		event.preventDefault();

		if (inputText === "") return;

		onCreate(inputText, state.roomId);

		setInputText("");
	};

	return (
		<div className="app">
			<h1>Amplify Chat app</h1>
			<pre>{JSON.stringify(state)}</pre>
			<div className="amplify-chat">
				<div className="sidebar">
					<nav className="navRooms">
						<h2>Rooms</h2>
						<ul>
							{rooms.map((room) => {
								return (
									<li
										key={room.id}
										onClick={() => setState({ ...state, roomId: room.id })}
									>
										{room.roomname}
									</li>
								);
							})}
						</ul>
					</nav>
					<div className="roomUsers">
						<h2>Users</h2>
						<ul>
							{users.map((user) => {
								return <li key={user.id}>{user}</li>;
							})}
						</ul>
					</div>
				</div>
				<div>
					<div className="messageList">
						{messages.map((message) => {
							return <div key={message.id}>{message.message}</div>;
						})}
					</div>
					<div className="messageInput">
						<input
							type="text"
							placeholder="message"
							onChange={(e) => setInputText(e.target.value)}
							value={inputText}
						/>
						<button onClick={sendMessage}>Send</button>
					</div>
				</div>
			</div>
		</div>
	);
}

export default App;
