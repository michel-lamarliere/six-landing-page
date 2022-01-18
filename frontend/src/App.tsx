import React, { useEffect, useCallback } from 'react';
import { Routes, Route, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';

import Log from './log/pages/Log';

import { RootState } from './shared/store/store';
import { useRequest } from './shared/hooks/http-hook';

import Profile from './user/pages/Profile';
import Navigation from './shared/components/layout/Navigation';
import ErrorPopup from './shared/components/UIElements/ErrorPopup';

const App: React.FC = () => {
	const navigate = useNavigate();
	const { sendRequest } = useRequest();
	const dispatch = useDispatch();
	const userState = useSelector((state: RootState) => state.user);
	const errorState = useSelector((state: RootState) => state.error);

	const autoLogIn = async () => {
		const credentials = localStorage.getItem('credentials');
		let parsedCredentials: { email: string; password: string };

		if (credentials) {
			parsedCredentials = JSON.parse(credentials);

			const responseData = await sendRequest(
				'http://localhost:8080/api/user/signin',
				'POST',
				JSON.stringify({
					email: parsedCredentials.email,
					password: parsedCredentials.password,
				})
			);

			if (responseData.error) {
				dispatch({ type: 'SET_ERROR', message: responseData.error });
				return;
			}

			dispatch({
				type: 'LOG_IN',
				token: responseData.token,
				id: responseData.id,
				email: responseData.email,
				name: responseData.name,
			});

			navigate('/log');
		}
	};

	useEffect(() => {
		autoLogIn();
	}, [userState.id]);

	useEffect(() => {
		if (errorState.message) {
			setTimeout(() => {
				dispatch({ type: 'REMOVE_ERROR' });
			}, 5000);
		}
	}, [errorState]);

	return (
		<>
			<Navigation />
			<Routes>
				<Route path='/log' element={<Log />} />
				<Route path='/profile' element={<Profile />} />
			</Routes>
			{errorState.message && <ErrorPopup message={errorState.message} />}
		</>
	);
};

export default App;
