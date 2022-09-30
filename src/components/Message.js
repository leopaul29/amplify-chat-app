import React from "react";
import { useEffect, useState } from "react";

import { DataStore, Predicates } from "@aws-amplify/datastore";
import { Messages } from "./models";

async function onUpdate(currentItem) {
	/* Models in DataStore are immutable. To update a record you must use the copyOf function
 to apply updates to the item’s fields rather than mutating the instance directly */
	await DataStore.save(
		Messages.copyOf(currentItem, (item) => {
			// Update the values on {item} variable to update DataStore entry
		})
	);
}
async function onQuery() {
	const models = await DataStore.query(Messages);
	console.log(models);
}
async function onDelete() {
	const modelToDelete = await DataStore.query(Messages, 123456789);
	DataStore.delete(modelToDelete);
}

async function onCreate() {
	await DataStore.save(
		new Messages({
			message: "Lorem ipsum dolor sit amet",
			usersID: "a3f4095e-39de-43d2-baf4-f8c16f0f6f4d",
			Messages: /* Provide a Messages instance here */ 1,
		})
	);
}

async function listMessages(setMessages) {
	const messages = await DataStore.query(Messages, Predicates.ALL);
	setMessages(messages);
}
function Message() {
	const [Messages, setMessages] = useState([]);
	useEffect(() => {
		listMessages(setMessages);

		const subscription = DataStore.observe(Messages).subscribe((msg) => {
			console.log("model", msg.model, msg.opType, msg.element);
			listMessages(setMessages);
		});

		return () => subscription.unsubscribe();
	}, []);
	return (
		<ul>
			{Messages.map((message) => {
				return <li key={message.id}>{message.message}</li>;
			})}
		</ul>
	);
}

export default Message;
