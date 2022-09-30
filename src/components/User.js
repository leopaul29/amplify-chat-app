import React from "react";
import { useEffect, useState } from "react";

import { DataStore, Predicates } from "@aws-amplify/datastore";
import { Users } from "./models";

async function onUpdate(currentItem) {
	/* Models in DataStore are immutable. To update a record you must use the copyOf function
 to apply updates to the item’s fields rather than mutating the instance directly */
	await DataStore.save(
		Users.copyOf(currentItem, (item) => {
			// Update the values on {item} variable to update DataStore entry
		})
	);
}
async function onQuery() {
	const models = await DataStore.query(Users);
	console.log(models);
}
async function onDelete() {
	const modelToDelete = await DataStore.query(Users, 123456789);
	DataStore.delete(modelToDelete);
}

async function onCreate() {
	await DataStore.save(
		new Users({
			usernam: "Lorem ipsum dolor sit amet",
			Messages: [],
		})
	);
}

async function listUsers(setUsers) {
	const users = await DataStore.query(Users, Predicates.ALL);
	setUsers(users);
}
function User() {
	const [users, setUsers] = useState([]);
	useEffect(() => {
		listUsers(setUsers);

		const subscription = DataStore.observe(Users).subscribe((msg) => {
			console.log("model", msg.model, msg.opType, msg.element);
			listUsers(setUsers);
		});

		return () => subscription.unsubscribe();
	}, []);
	return (
		<ul>
			{users.map((user) => {
				return <li key={user.id}>{user.username}</li>;
			})}
		</ul>
	);
}

export default User;
