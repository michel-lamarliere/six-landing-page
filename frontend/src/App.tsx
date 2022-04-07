import React, { useEffect } from 'react';
import { Routes, Route, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';

import { isBefore } from 'date-fns';

import { RootState } from './_shared/store/_store';
import { UserActionTypes } from './_shared/store/user';
import { EmailConfirmationPopUpActionTypes } from './_shared/store/pop-ups/email-confirmation-pop-up';
import { AlertPopUpActionTypes } from './_shared/store/pop-ups/alert-pop-up';

import LoginSignupForms from './login-signup-forms/pages/LoginSignupForms';
import DailyView from './views/daily/pages/DailyView';
import WeeklyView from './views/weekly/pages/WeeklyView';
import MonthlyView from './views/monthly/pages/MonthlyView';
import Error404 from './error404/Error404';
import ErrorPopup from './pop-ups/pages/ErrorPopUp';
import EmailConfirmationPopup from './pop-ups/pages/EmailConfirmationPopUp';
import ConfirmEmailAddress from './modify-user/logged-out/pages/ChangeEmailAddressConfirmation';
import ChangeForgottenPassword from './modify-user/logged-out/pages/ChangeForgottenPassword';
import Overlay from './_shared/components/UIElements/Overlay';
import HamburgerButton from './_shared/components/UIElements/HamburgerButton';
import Profile from './user-profile/pages/UserProfile';
import ChangeName from './modify-user/logged-in/pages/ChangeName';
import ChangeEmail from './modify-user/logged-in/pages/ChangeEmail';
import ChangePassword from './modify-user/logged-in/pages/ChangePassword';
import ChangeImage from './modify-user/logged-in/pages/ChangeImage';
import AnnualChart from './charts/pages/AnnualChart';
import Homepage from './homepage/pages/Homepage';
import DesktopSidebar from './layout/sidebar/pages/DesktopSidebar';
import MobileSidebar from './layout/sidebar/pages/MobileSidebar';
import DeleteAccount from './modify-user/logged-in/pages/DeleteAccount';
import DeleteAccountConfirm from './modify-user/logged-in/pages/DeleteAccountConfirmation';
import ChangeEmailConfirm from './modify-user/logged-in/pages/ChangeEmailConfirm';
import AlertPopup from './pop-ups/pages/AlertPopUp';
import ForgotPasswordPopUp from './pop-ups/pages/ForgotPasswordPopUp';

const App: React.FC = () => {
	const navigate = useNavigate();
	const dispatch = useDispatch();

	const userState = useSelector((state: RootState) => state.user);
	const overlayState = useSelector((state: RootState) => state.overlay);
	const alertPopUpState = useSelector((state: RootState) => state.alertPopUp);
	const errorPopUpState = useSelector((state: RootState) => state.errorPopUp);
	const emailConfirmationPopUpState = useSelector(
		(state: RootState) => state.emailConfirmationPopUp
	);
	const forgotPasswordPopUpState = useSelector(
		(state: RootState) => state.forgotPasswordPopUp
	);

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
			dispatch({ type: UserActionTypes.LOG_USER_OUT });
			navigate('/');
			return;
		}

		dispatch({
			type: UserActionTypes.LOG_USER_IN,
			token: userData.token,
			expiration: userData.expiration,
			id: userData.id,
			icon: userData.icon,
			email: userData.email,
			confirmedEmail: userData.confirmedEmail,
			name: userData.name,
		});

		if (!userData.confirmedEmail && showEmailConfirmationPopup) {
			dispatch({
				type: EmailConfirmationPopUpActionTypes.SHOW_EMAIL_CONFIRMATION_POP_UP,
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
				type: AlertPopUpActionTypes.SET_AND_SHOW_ALERT_POP_UP,
				message: 'Votre session a expiré, veuillez vous reconnecter.',
			});

			dispatch({
				type: EmailConfirmationPopUpActionTypes.HIDE_EMAIL_CONFIRMATION_POP_UP,
			});

			dispatch({ type: UserActionTypes.LOG_USER_OUT });

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
			{overlayState.show && <Overlay />}
			{alertPopUpState.message && <AlertPopup message={alertPopUpState.message} />}
			{errorPopUpState.message && <ErrorPopup message={errorPopUpState.message} />}
			{emailConfirmationPopUpState.show && <EmailConfirmationPopup />}
			{forgotPasswordPopUpState.show && <ForgotPasswordPopUp />}
			<Routes>
				{!userData && (
					// LOGGED OUT
					<>
						<Route path='/' element={<Homepage />} />
						<Route path='/login-signup' element={<LoginSignupForms />} />
					</>
				)}
				{userData && (
					// LOGGED IN
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
							path='/profil/modifier/mot-de-passe'
							element={<ChangePassword />}
						/>
						<Route
							path='/profil/modifier/supprimer-compte'
							element={<DeleteAccount />}
						/>
					</>
				)}
				{/* //LOGGED IN OR OUT*/}
				<Route
					path='/profil/confirmation/:email/:code'
					element={<ConfirmEmailAddress />}
				/>
				<Route
					path='/supprimer-compte/confirmation/:email/:code'
					element={<DeleteAccountConfirm />}
				/>
				<Route
					path='/modifier-email/confirmation/:oldEmail/:newEmail'
					element={<ChangeEmailConfirm />}
				/>
				<Route
					path='/modifier/mot-de-passe/:email/:uniqueId'
					element={<ChangeForgottenPassword />}
				/>
				<Route path='*' element={<Error404 />} />
			</Routes>
		</>
	);
};

export default App;
