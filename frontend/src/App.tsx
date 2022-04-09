import React, { useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import { useSelector } from 'react-redux';

import { RootState } from './_shared/store/_store';

import { useUserClass } from './_shared/classes/user-class-hook';

import LoginSignupForms from './login-signup-forms/pages/LoginSignupForms';
import DailyView from './views/daily/pages/DailyView';
import WeeklyView from './views/weekly/pages/WeeklyView';
import MonthlyView from './views/monthly/pages/MonthlyView';
import Error404 from './error404/Error404';
import ErrorPopup from './pop-ups/pages/ErrorPopUp';
import EmailConfirmationPopup from './pop-ups/pages/EmailConfirmationPopUp';
import EmailAddressConfirmation from './modify-user/logged-out/pages/ChangeEmailAddressConfirmation';
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
import DeleteAccountConfirmation from './modify-user/logged-in/pages/DeleteAccountConfirmation';
import ChangeEmailConfirmation from './modify-user/logged-in/pages/ChangeEmailConfirmation';
import AlertPopup from './pop-ups/pages/AlertPopUp';
import ForgotPasswordPopUp from './pop-ups/pages/ForgotPasswordPopUp';
import Contact from './contact/pages/Contact';

const App: React.FC = () => {
	const { User } = useUserClass();

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

	useEffect(() => {
		User.autoLogIn();
	}, []);

	useEffect(() => {
		User.checkTokenIsExpired();
	}, [userState.tokenExpiration]);

	return (
		<>
			{User.isLoggedIn() && <HamburgerButton />}
			{User.isLoggedIn() && <DesktopSidebar />}
			{User.isLoggedIn() && <MobileSidebar />}
			{/* {overlayState.show && <Overlay />} */}
			{alertPopUpState.message && <AlertPopup message={alertPopUpState.message} />}
			{errorPopUpState.message && <ErrorPopup message={errorPopUpState.message} />}
			{emailConfirmationPopUpState.show && <EmailConfirmationPopup />}
			{forgotPasswordPopUpState.show && <ForgotPasswordPopUp />}
			<Routes>
				{!User.isLoggedIn() && (
					<>
						<Route path='/' element={<Homepage />} />
						<Route path='/login-signup' element={<LoginSignupForms />} />
					</>
				)}
				{User.isLoggedIn() && (
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
						<Route path='/contact' element={<Contact />} />
					</>
				)}
				<Route
					path='/profil/confirmation/:email/:code'
					element={<EmailAddressConfirmation />}
				/>
				<Route
					path='/supprimer-compte/confirmation/:email/:code'
					element={<DeleteAccountConfirmation />}
				/>
				<Route
					path='/modifier-email/confirmation/:oldEmail/:newEmail'
					element={<ChangeEmailConfirmation />}
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
