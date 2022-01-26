import React, { useEffect } from 'react';
import { Routes, Route, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { isBefore } from 'date-fns';

import { RootState } from './shared/store/store';

import LoginSignupForms from './app/components/LoginSignupForms';
import Sidebar from './shared/components/layout/Sidebar';
import DailyView from './log/pages/DailyView';
import WeeklyView from './log/pages/WeeklyView';
import MonthlyView from './log/pages/MonthlyView';
import Profile from './user/pages/Profile';
import ErrorPopup from './shared/components/UIElements/ErrorPopup';

const App: React.FC = () => {
	const navigate = useNavigate();
	const dispatch = useDispatch();

	const userState = useSelector((state: RootState) => state.user);
	const errorState = useSelector((state: RootState) => state.error);

	const autoLogIn = async () => {
		const storedUserData = localStorage.getItem('userData');

		let userData: {
			id: string;
			token: string;
			expiration: string;
			email: string;
			name: string;
		};

		if (!storedUserData) return;

		userData = JSON.parse(storedUserData);

		if (isBefore(new Date(userData.expiration), new Date())) {
			dispatch({ type: 'LOG_OUT' });
			navigate('/');
			return;
		}

		dispatch({
			type: 'LOG_IN',
			token: userData.token,
			expiration: userData.expiration,
			id: userData.id,
			email: userData.email,
			name: userData.name,
		});
	};

	useEffect(() => {
		// const storedUserData = localStorage.getItem('userData');

		// if (!storedUserData) {
		// 	navigate('/');
		// 	return;
		// }
		autoLogIn();
	}, []);

	useEffect(() => {
		if (!userState.expiration) {
			return;
		}

		let remainingTime =
			new Date(userState.expiration).getTime() - new Date().getTime();

		setTimeout(() => {
			dispatch({
				type: 'SET_ERROR',
				message: 'Votre session a expiré, veuillez vous reconnecter.',
			});
			localStorage.removeItem('userData');
			dispatch({ type: 'LOG_OUT' });
			// dispatch({ type: ActionType.Logout });
			navigate('/');
		}, remainingTime);
	}, [userState.expiration]);

	useEffect(() => {
		if (errorState.message) {
			setTimeout(() => {
				dispatch({ type: 'REMOVE_ERROR' });
			}, 5000);
		}
	}, [errorState]);

	return (
		<>
			<LoginSignupForms />
			<Sidebar />
			{userState.token && (
				<div className='main'>
					<Routes>
						<Route path='/log/daily' element={<DailyView />} />
						<Route path='/log/weekly' element={<WeeklyView />} />
						<Route path='/log/monthly' element={<MonthlyView />} />
						<Route path='/profile' element={<Profile />} />
					</Routes>
				</div>
			)}
			{errorState.message && <ErrorPopup message={errorState.message} />}
		</>
	);
};

export default App;
