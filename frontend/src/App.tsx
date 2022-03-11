import React, { useEffect } from 'react';
import { Routes, Route, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';

import { isBefore } from 'date-fns';

import { RootState } from './_shared/store/store';
import { UserActionTypes } from './_shared/store/user';
import { EmailConfirmationActionTypes } from './_shared/store/email-confirmation';
import { ErrorPopupActionTypes } from './_shared/store/error';

import LoginSignupForms from './pages/LoginSignupForms';
import Sidebar from './layout/pages/Sidebar';
import DailyView from './log/pages/DailyView';
import WeeklyView from './log/pages/WeeklyView';
import MonthlyView from './log/pages/MonthlyView';
import Profile from './user/pages/Profile';
import Error404 from './pages/Error404';
import ErrorPopup from './pop-ups/ErrorPopup';
import EmailPopup from './pop-ups/EmailConfirmationPopup';
import ConfirmEmailAddress from './user/pages/ConfirmedEmailAddress';
import ForgotPasswordForm from './user/pages/ForgotPasswordForm';
import AnnualChart from './charts/pages/AnnualChart';
import Overlay from './_shared/components/UIElements/Overlay';

const App: React.FC = () => {
	const navigate = useNavigate();
	const dispatch = useDispatch();

	const userState = useSelector((state: RootState) => state.user);
	const errorState = useSelector((state: RootState) => state.error);
	const emailState = useSelector((state: RootState) => state.email);
	const uiElementsState = useSelector((state: RootState) => state.uiElements);

	const autoLogIn = async () => {
		const storedUserData = localStorage.getItem('userData');
		let showEmailConfirmationPopup = sessionStorage.getItem(
			'showEmailConfirmationPopup'
		);

		if (showEmailConfirmationPopup) {
			showEmailConfirmationPopup = JSON.parse(showEmailConfirmationPopup);
		}

		if (!storedUserData) return;

		let userData = JSON.parse(storedUserData);

		if (isBefore(new Date(userData.expiration), new Date())) {
			console.log('oui');
			dispatch({ type: UserActionTypes.LOG_OUT });
			navigate('/');
			return;
		}

		dispatch({
			type: UserActionTypes.LOG_IN,
			token: userData.token,
			expiration: userData.expiration,
			id: userData.id,
			email: userData.email,
			confirmedEmail: userData.confirmedEmail,
			name: userData.name,
		});

		if (!userData.confirmedEmail && showEmailConfirmationPopup) {
			dispatch({
				type: EmailConfirmationActionTypes.SHOW,
			});
		}
	};

	useEffect(() => {
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
				type: ErrorPopupActionTypes.SET_ERROR,
				message: 'Votre session a expiré, veuillez vous reconnecter.',
			});

			dispatch({ type: UserActionTypes.LOG_OUT });

			navigate('/');
		}, remainingTime);
	}, [userState.expiration]);

	useEffect(() => {
		console.log(uiElementsState.showCalendarOverlay);
	}, [uiElementsState]);

	const userData =
		userState.token &&
		userState.expiration &&
		userState.id &&
		userState.name &&
		userState.email;

	useEffect(() => {
		const sidebar = document.getElementById('sidebar')!;
		if (!userData) {
			sidebar.style.display = 'none';
		} else {
			sidebar.style.display = 'flex';
		}
	}, [userData]);

	return (
		<>
			{userData && <Sidebar />}
			{uiElementsState.showCalendarOverlay && <Overlay />}
			<Routes>
				{!userData && <Route path='/' element={<LoginSignupForms />} />}
				{userData && (
					<>
						<Route path='/' element={<DailyView />} />
						<Route path='/journal/quotidien' element={<DailyView />} />
						<Route path='/journal/hebdomadaire' element={<WeeklyView />} />
						<Route path='/journal/mensuel' element={<MonthlyView />} />
						<Route path='/graphique' element={<AnnualChart />} />
						<Route path='/profil' element={<Profile />} />
					</>
				)}
				<Route
					path='/profil/confirmation/:email/:code'
					element={<ConfirmEmailAddress />}
				/>
				<Route
					path='/modifier/motdepasse/:email/:uniqueId'
					element={<ForgotPasswordForm />}
				/>
				<Route path='*' element={<Error404 />} />
			</Routes>

			{errorState.message && <ErrorPopup message={errorState.message} />}
			{emailState.show && <EmailPopup />}
		</>
	);
};

export default App;
