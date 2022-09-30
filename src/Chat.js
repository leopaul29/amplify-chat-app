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
	const [inputText, setInputText] = useState([]);

	const onChange = (e) => {
		setInputText(e.target.value);
	};

	const handleSubmit = (event) => {
		console.log("Form was submitted!", event);
	};

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
			<div className="messageList">
				{messages.map((message) => {
					return <div key={message.id}>{message.message}</div>;
				})}
			</div>
			<form onSubmit={handleSubmit}>
				<div className="messageInput">
					<input
						type="text"
						placeholder="message"
						onChange={onChange}
						value={inputText}
					/>
					<button type="submit">Submit</button>
				</div>
			</form>
		</div>
	);
}

export default Chat;
