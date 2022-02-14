import React, { useEffect } from 'react';
import { Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { isBefore } from 'date-fns';

import { RootState } from './shared/store/store';
import { UserActionTypes } from './shared/store/user';
import { EmailConfirmationActionTypes } from './shared/store/email-confirmation';
import { ErrorPopupActionTypes } from './shared/store/error';

import { useRequest } from './shared/hooks/http-hook';

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
import dateAndTaskStr from './charts/pages/AnnualChart';
import AnnualChart from './charts/pages/AnnualChart';
import Overlay from './shared/components/UIElements/Overlay';

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

	const main_loggedIn = userData ? 'main__logged-in' : 'main__right';

	return (
		<>
			{userData && <Sidebar />}
			{uiElementsState.showCalendarOverlay && <Overlay />}
			<div className='main'>
				<div className={main_loggedIn}>
					<Routes>
						{!userData && <Route path='/' element={<LoginSignupForms />} />}
						{userData && (
							<>
								<Route path='/' element={<DailyView />} />
								<Route path='/log/daily' element={<DailyView />} />
								<Route path='/log/weekly' element={<WeeklyView />} />
								<Route path='/log/monthly' element={<MonthlyView />} />
								<Route path='/recap' element={<AnnualChart />} />
								<Route path='/profile' element={<Profile />} />
							</>
						)}
						<Route
							path='/profile/confirm/:email/:code'
							element={<ConfirmEmailAddress />}
						/>
						<Route
							path='/modify/password/:email/:uniqueId'
							element={<ForgotPasswordForm />}
						/>
						<Route path='*' element={<Error404 />} />
					</Routes>
				</div>
				{errorState.message && <ErrorPopup message={errorState.message} />}
				{emailState.show && <EmailPopup />}
			</div>
		</>
	);
};

export default App;
