import React, { useEffect } from 'react';
import { Route, Routes, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';

import Log from './log/pages/Log';

import { RootState } from './shared/store/store';

import Navigation from './shared/components/layout/Navigation';

const App: React.FC = () => {
	const navigate = useNavigate();
	const dispatch = useDispatch();
	const userState = useSelector((state: RootState) => state);

	const autoLogIn = async () => {
		const credentials = localStorage.getItem('credentials');
		let parsedCredentials: { email: string; password: string };
		if (credentials) {
			parsedCredentials = JSON.parse(credentials);

			const response = await fetch('http://localhost:8080/api/users/signin', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({
					email: parsedCredentials.email,
					password: parsedCredentials.password,
				}),
			});
			const responseJson = await response.json();

			dispatch({
				type: 'LOG_IN',
				token: responseJson.token,
				id: responseJson.id,
				email: responseJson.email,
				name: responseJson.name,
			});
			navigate('/log/weekly');
		}
	};
	useEffect(() => {
		autoLogIn();
	}, [userState.id]);

	return (
		<>
			<Navigation />
			<Routes>
				<Route path='/log/weekly' element={<Log />} />
			</Routes>
		</>
	);
};

export default App;
