import React, { useEffect } from 'react';
import { Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { isBefore } from 'date-fns';

import { RootState } from './shared/store/store';

import LoginSignupForms from './app/components/LoginSignupForms';
import Sidebar from './shared/components/layout/Sidebar';
import DailyView from './log/pages/DailyView';
import WeeklyView from './log/pages/WeeklyView';
import MonthlyView from './log/pages/MonthlyView';
import Profile from './user/pages/Profile';
import Error404 from './shared/error404/pages/Error404';
import ErrorPopup from './shared/components/UIElements/ErrorPopup';
import EmailPopup from './shared/components/UIElements/EmailPopup';

const App: React.FC = () => {
	const navigate = useNavigate();
	const dispatch = useDispatch();

	const userState = useSelector((state: RootState) => state.user);
	const errorState = useSelector((state: RootState) => state.error);
	const emailState = useSelector((state: RootState) => state.email);

	const autoLogIn = async () => {
		const storedUserData = localStorage.getItem('userData');

		let userData: {
			id: string;
			token: string;
			expiration: string;
			email: string;
			confirmedEmail: boolean;
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
			confirmedEmail: userData.confirmedEmail,
			name: userData.name,
		});
	};

	useEffect(() => {
		autoLogIn();
		const confirmedEmail = sessionStorage.getItem('confirmedEmail');
		if (confirmedEmail) {
			dispatch({ type: 'SHOW' });
		}
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

	const main_right_loggedIn = userState.token ? 'main_right_logged-in' : 'main_right';

	return (
		<div className='main'>
			{userState.token && <Sidebar />}
			<div className={main_right_loggedIn}>
				<Routes>
					{!userState.token && (
						<Route path='/' element={<LoginSignupForms />} />
					)}
					{userState.token && (
						<>
							<Route path='/' element={<DailyView />} />
							<Route path='/log/daily' element={<DailyView />} />
							<Route path='/log/weekly' element={<WeeklyView />} />
							<Route path='/log/monthly' element={<MonthlyView />} />
							<Route path='/profile' element={<Profile />} />
						</>
					)}
					<Route path='*' element={<Error404 />} />
				</Routes>
			</div>
			{errorState.message && <ErrorPopup message={errorState.message} />}
			{emailState.show && <EmailPopup />}
		</div>
	);
};

export default App;
