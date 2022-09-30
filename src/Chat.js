import React, { useEffect, useState } from "react";
import "./App.css";
import { DataStore, Predicates } from "@aws-amplify/datastore";
import { Messages } from "./models";

async function listMessages(setMessages) {
	const messages = await DataStore.query(Messages, Predicates.ALL);
	setMessages(messages);
}
function Chat() {
	const [messages, setMessages] = useState([]);

	useEffect(() => {
		listMessages(setMessages);

		const subscription = DataStore.observe(Messages).subscribe((msg) => {
			console.log("model", msg.model, msg.opType, msg.element);
			listMessages(setMessages);
		});

		return () => subscription.unsubscribe();
	}, []);
	return (
		<div>
			{messages.map((message) => {
				return <li key={message.id}>{message.message}</li>;
			})}
		</div>
	);
}

export default Chat;
