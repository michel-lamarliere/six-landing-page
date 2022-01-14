import React, { useEffect, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import Log from './log/pages/Log';

import { RootState } from './shared/store/store';
import { useRequest } from './shared/hooks/http-hook';

import Navigation from './shared/components/layout/Navigation';
import ErrorPopup from './shared/components/UIElements/ErrorPopup';

const App: React.FC = () => {
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
				'http://localhost:8080/api/users/signin',
				'POST',
				JSON.stringify({
					email: parsedCredentials.email,
					password: parsedCredentials.password,
				})
			);

			dispatch({
				type: 'LOG_IN',
				token: responseData.token,
				id: responseData.id,
				email: responseData.email,
				name: responseData.name,
			});
		}
	};

	useEffect(() => {
		autoLogIn();
	}, [userState.id]);

	useEffect(() => {
		if (errorState.message) {
			setTimeout(() => {
				dispatch({ type: 'REMOVE-ERROR' });
			}, 10000);
		}
	}, [errorState]);

	return (
		<>
			<Navigation />
			<Log />
			{errorState.message && <ErrorPopup message={errorState.message} />}
		</>
	);
};

export default App;
