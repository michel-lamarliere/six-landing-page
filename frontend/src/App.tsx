import React, { useEffect } from 'react';
import { Routes, Route, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';

import { isBefore } from 'date-fns';

import { RootState } from './_shared/store/_store';
import { UserActionTypes } from './_shared/store/user';
import { PopUpActionTypes } from './_shared/store/pop-ups';

import LoginSignupForms from './login-signup-forms/pages/LoginSignupForms';
import DailyView from './views/daily/pages/DailyView';
import WeeklyView from './views/weekly/pages/WeeklyView';
import MonthlyView from './views/monthly/pages/MonthlyView';
import Error404 from './error404/Error404';
import ErrorPopup from './pop-ups/pages/ErrorPopUp';
import EmailPopup from './pop-ups/pages/EmailConfirmationPopUp';
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

const App: React.FC = () => {
	const navigate = useNavigate();
	const dispatch = useDispatch();

	const userState = useSelector((state: RootState) => state.user);
	const uiElementsState = useSelector((state: RootState) => state.uiElements);
	const popUpsState = useSelector((state: RootState) => state.popUps);

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
			icon: userData.icon,
			email: userData.email,
			confirmedEmail: userData.confirmedEmail,
			name: userData.name,
		});

		if (!userData.confirmedEmail && showEmailConfirmationPopup) {
			dispatch({
				type: PopUpActionTypes.SHOW_EMAIL_CONFIRMATION,
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
				type: PopUpActionTypes.SET_AND_SHOW_ALERT,
				message: 'Votre session a expiré, veuillez vous reconnecter.',
			});
			dispatch({ type: PopUpActionTypes.HIDE_EMAIL_CONFIRMATION });

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
						<Route path='/' element={<Homepage />} />
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
							path='/profil/modifier/mot-de-passe'
							element={<ChangePassword />}
						/>
						<Route
							path='/profil/modifier/supprimer-compte'
							element={<DeleteAccount />}
						/>
					</>
				)}
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
			{popUpsState.alertMessage && (
				<AlertPopup message={popUpsState.alertMessage} />
			)}
			{popUpsState.errorMessage && (
				<ErrorPopup message={popUpsState.errorMessage} />
			)}

			{popUpsState.showEmailConfirmation && <EmailPopup />}
		</>
	);
};

export default App;
