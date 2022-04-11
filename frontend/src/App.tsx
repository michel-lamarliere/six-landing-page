import React, { useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import { useSelector } from 'react-redux';

import { RootState } from './store/_store';

import { useUserClass } from './classes/user-class-hook';

import LoginSignupForms from './pages/login-signup/LogInSignUpPage/LogInSignUpPage';
import DailyView from './pages/log/DailyView/DailyViewPage/DailyViewPage';
import WeeklyView from './pages/log/WeeklyView/WeeklyViewPage/WeeklyViewPage';
import MonthlyView from './pages/log/MonthlyView/MonthlyViewPage/MonthlyViewPage';
import Error404 from './pages/Error404Page/Error404Page';
import ErrorPopup from './components/pop-ups/alert-or-error-pop-up/ErrorPopUp/ErrorPopUp';
import EmailConfirmationPopup from './components/pop-ups/pop-ups/EmailConfirmationPopUp/EmailConfirmationPopUp';
import EmailAddressConfirmation from './pages/after-emails/EmailAddressConfirmationPage/EmailAddressConfirmationPage';
import ChangeForgottenPassword from './pages/after-emails/ChangeForgottenPasswordPage/ChangeForgottenPasswordPage';
import Overlay from './components/overlays/Overlay';
import HamburgerButton from './components/buttons/HamburgerButton/HamburgerButton';
import Profile from './pages/UserProfile/UserProfilePage/UserProfilePage';
import ChangeName from './pages/edit-user/ChangeNamePage/ChangeNamePage';
import ChangeEmail from './pages/edit-user/ChangeEmail/ChangeEmailPage/ChangeEmailPage';
import ChangePassword from './pages/edit-user/ChangePasswordPage/ChangePasswordPage';
import ChangeImage from './pages/edit-user/ChangeImagePage/ChangeImagePage';
import AnnualChart from './pages/charts/AnnualChartPage/AnnualChartPage';
import Homepage from './pages/Homepage/HomepagePage/HomepagePage';
import DesktopSidebar from './components/layout/DesktopSidebar/DesktopSidebar';
import MobileSidebar from './components/layout/MobileSidebar/MobileSidebar';
import DeleteAccount from './pages/edit-user/DeleteAccount/DeleteAccountPage/DeleteAccountPage';
import DeleteAccountConfirmation from './pages/edit-user/DeleteAccount/DeleteAccountConfirmation/DeleteAccountConfirmation';
import ChangeEmailConfirmation from './pages/edit-user/ChangeEmail/ChangeEmailConfirmation/ChangeEmailConfirmation';
import AlertPopup from './components/pop-ups/alert-or-error-pop-up/AlertPopUp/AlertPopUp';
import ForgotPasswordPopUp from './components/pop-ups/pop-ups/ForgotPasswordPopUp/ForgotPasswordPopUp';
import Contact from './pages/ContactPage/ContactPage';

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
