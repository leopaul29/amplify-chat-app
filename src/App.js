import React, { useState } from "react";
import "./App.css";
import awsConfig from "./aws-exports";

import Amplify from "@aws-amplify/core";
import NavRoom from "./NavRoom";
import Chat from "./Chat";
Amplify.configure(awsConfig);

function App() {
	return (
		<div className="App">
			<h1>Amplify Chat app</h1>
			<div className="amplify-chat">
				<NavRoom />
				<Chat />
			</div>
		</div>
	);
}

export default App;
