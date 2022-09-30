import React from "react";
import { useEffect, useState } from "react";

import { DataStore, Predicates } from "@aws-amplify/datastore";
import { Rooms } from "./models";

async function onUpdate(currentItem) {
	/* Models in DataStore are immutable. To update a record you must use the copyOf function
 to apply updates to the item’s fields rather than mutating the instance directly */
	await DataStore.save(
		Rooms.copyOf(currentItem, (item) => {
			// Update the values on {item} variable to update DataStore entry
		})
	);
}
async function onQuery() {
	const models = await DataStore.query(Rooms);
	console.log(models);
}
async function onDelete() {
	const modelToDelete = await DataStore.query(Rooms, 123456789);
	DataStore.delete(modelToDelete);
}

async function onCreate() {
	await DataStore.save(
		new Rooms({
			roomname: "Lorem ipsum dolor sit amet",
		})
	);
}

async function listRooms(setRooms) {
	const rooms = await DataStore.query(Rooms, Predicates.ALL);
	setRooms(rooms);
}
function Room() {
	const [rooms, setRooms] = useState([]);
	useEffect(() => {
		listRooms(setRooms);

		const subscription = DataStore.observe(Rooms).subscribe((msg) => {
			console.log("model", msg.model, msg.opType, msg.element);
			listRooms(setRooms);
		});

		return () => subscription.unsubscribe();
	}, []);
	return (
		<ul>
			{rooms.map((room) => {
				return <li key={room.id}>{room.roomname}</li>;
			})}
		</ul>
	);
}

export default Room;
