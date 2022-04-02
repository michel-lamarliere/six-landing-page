import React, { useEffect } from 'react';
import { Routes, Route, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';

import { isBefore } from 'date-fns';

import { RootState } from './_shared/store/store';
import { UserActionTypes } from './_shared/store/user';
import { EmailConfirmationActionTypes } from './_shared/store/email-confirmation';
import { ErrorPopupActionTypes } from './_shared/store/error';

import LoginSignupForms from './login-signup/pages/LoginSignupForms';
import Sidebar from './layout/components/Sidebar';
import DailyView from './log/pages/DailyView';
import WeeklyView from './log/pages/WeeklyView';
import MonthlyView from './log/pages/MonthlyView';
import Error404 from './error/pages/Error404';
import ErrorPopup from './pop-ups/ErrorPopup';
import EmailPopup from './pop-ups/EmailConfirmationPopup';
import ConfirmEmailAddress from './user/pages/ConfirmedEmailAddress';
import ForgotPasswordForm from './user/pages/ForgotPasswordForm';
import Overlay from './_shared/components/UIElements/Overlay';
import HamburgerButton from './_shared/components/UIElements/HamburgerButton';
import Profile from './user/pages/Profile';
import ChangeName from './user/pages/ChangeName';
import ChangeEmail from './user/pages/ChangeEmail';
import ChangePassword from './user/pages/ChangePassword';
import ChangeImage from './user/pages/ChangeImage';
import AnnualChart from './charts/pages/AnnualChart';
import HomePage from './homepage/pages/HomePage';
import DesktopSidebar from './layout/pages/DesktopSidebar';
import MobileSidebar from './layout/pages/MobileSidebar';

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
			dispatch({ type: EmailConfirmationActionTypes.HIDE });

			dispatch({ type: UserActionTypes.LOG_OUT });

			navigate('/');
		}, remainingTime);
	}, [userState.expiration]);

	const userData =
		userState.token &&
		userState.expiration &&
		userState.id &&
		userState.name &&
		userState.email;

	return (
		<>
			{userData && <HamburgerButton />}
			{userData && <DesktopSidebar />}
			{userData && <MobileSidebar />}
			{uiElementsState.showOverlay && <Overlay />}
			<Routes>
				{!userData && (
					<>
						<Route path='/' element={<HomePage />} />
						<Route path='/login-signup' element={<LoginSignupForms />} />
					</>
				)}
				{userData && (
					<>
						<Route path='/' element={<DailyView />} />
						<Route path='/journal/quotidien' element={<DailyView />} />
						<Route path='/journal/hebdomadaire' element={<WeeklyView />} />
						<Route path='/journal/mensuel' element={<MonthlyView />} />
						<Route path='/graphique' element={<AnnualChart />} />
						<Route path='/profil' element={<Profile />} />

						<Route path='/profil/modifier/image' element={<ChangeImage />} />
						<Route path='/profil/modifier/nom' element={<ChangeName />} />
						<Route path='/profil/modifier/email' element={<ChangeEmail />} />
						<Route
							path='/profil/modifier/motdepasse'
							element={<ChangePassword />}
						/>
					</>
				)}
				<Route
					path='/profil/confirmer/:email/:code'
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
