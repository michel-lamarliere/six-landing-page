import React, { useEffect, useState } from 'react';
import { BrowserRouter, Route } from 'react-router-dom';

import Navigation from './shared/components/layout/Navigation';
import Users from './users/pages/Users';

const App: React.FC = () => {
	const [users, setUsers] = useState([]);

	const requestFn = async () => {
		const response = await fetch('http://localhost:8080/api/users', {
			method: 'GET',
			headers: {
				'Content-Type': 'application/json',
			},
		});
		const responseData = await response.json();
		setUsers(responseData.users);
	};

	return (
		<BrowserRouter>
			<Navigation />
			<Users usersList={users} fetchFn={requestFn} />
		</BrowserRouter>
	);
};

export default App;
