import React, { useEffect, useState } from 'react';
import { Routes, Route } from 'react-router-dom';
import { useSelector } from 'react-redux';

import { RootState } from './store/_store';

import { useUserClass } from './classes/user-class-hook';

import DailyView from './pages/views/DailyView/DailyViewPage/DailyViewPage';
import WeeklyView from './pages/views/WeeklyView/WeeklyViewPage/WeeklyViewPage';
import MonthlyView from './pages/views/MonthlyView/MonthlyViewPage/MonthlyViewPage';
import Error404 from './pages/Error404Page/Error404Page';
import ErrorPopup from './components/pop-ups/ErrorPopUp/ErrorPopUp';
import EmailConfirmationPopup from './components/pop-ups/EmailConfirmationPopUp/EmailConfirmationPopUp';
import EmailAddressConfirmation from './pages/EmailAddressConfirmationPage/EmailAddressConfirmationPage';
import ChangeForgottenPassword from './pages/ChangeForgottenPasswordPage/ChangeForgottenPasswordPage';
import Overlay from './components/Overlay/Overlay';
import HamburgerButton from './components/buttons/HamburgerButton/HamburgerButton';
import Profile from './pages/UserProfile/UserProfilePage/UserProfilePage';
import ChangeName from './pages/edit-user/ChangeNamePage/ChangeNamePage';
import ChangeEmail from './pages/edit-user/ChangeEmail/ChangeEmailPage/ChangeEmailPage';
import ChangePassword from './pages/edit-user/ChangePasswordPage/ChangePasswordPage';
import ChangeImage from './pages/edit-user/ChangeImagePage/ChangeImagePage';
import AnnualChart from './pages/AnnualChartPage/AnnualChartPage';
import Homepage from './pages/Homepage/HomepagePage/HomepagePage';
import DesktopSidebar from './components/layout/DesktopSidebar/DesktopSidebar';
import MobileSidebar from './components/layout/MobileSidebar/MobileSidebar';
import DeleteAccount from './pages/edit-user/DeleteAccount/DeleteAccountPage/DeleteAccountPage';
import DeleteAccountConfirmation from './pages/edit-user/DeleteAccount/DeleteAccountConfirmation/DeleteAccountConfirmation';
import ChangeEmailConfirmation from './pages/edit-user/ChangeEmail/ChangeEmailConfirmation/ChangeEmailConfirmation';
import AlertPopup from './components/pop-ups/AlertPopUp/AlertPopUp';
import ForgotPasswordPopUp from './components/pop-ups/ForgotPasswordPopUp/ForgotPasswordPopUp';
import Contact from './pages/ContactPage/ContactPage';
import LogInForm from './pages/LogInForm/LogInForm';
import SignUpForm from './pages/SignUpForm/SignUpForm';
import HelpPage from './pages/help/HelpPage/HelpPage';
import SleepPage from './pages/tasks/SleepPage';
import SocialLifePage from './pages/tasks/SocialLifePage';
import ProjectsPage from './pages/tasks/ProjectsPage';
import RelaxationPage from './pages/tasks/RelaxationPage';
import NutritionPage from './pages/tasks/NutritionPage';
import SportsPage from './pages/tasks/SportsPage';
import LegalNoticePage from './pages/LegalNoticePage/LegalNoticePage';

const App: React.FC = () => {
	const { User } = useUserClass();

	const [windowWidth, setWindowWidth] = useState(window.innerWidth);

	const userState = useSelector((state: RootState) => state.user);
	const overlayState = useSelector((state: RootState) => state.overlay);
	const mobileSidebarState = useSelector((state: RootState) => state.mobileSidebar);
	const alertPopUpState = useSelector((state: RootState) => state.alertPopUp);
	const errorPopUpState = useSelector((state: RootState) => state.errorPopUp);
	const emailConfirmationPopUpState = useSelector(
		(state: RootState) => state.emailConfirmationPopUp
	);
	const forgotPasswordPopUpState = useSelector(
		(state: RootState) => state.forgotPasswordPopUp
	);
	const logOutConfirmationPopUpState = useSelector(
		(state: RootState) => state.logOutConfirmationPopUp
	);

	useEffect(() => {
		User.autoLogIn();
	}, []);

	useEffect(() => {
		User.checkTokenIsExpired();
	}, [userState.tokenExpiration]);

	useEffect(() => {
		let desktopSidebar = document.getElementById('desktop-sidebar')!;
		let root = document.getElementById('root')!;

		if (!User.isLoggedIn()) {
			desktopSidebar.style.display = 'none';
			root.style.width = '100%';
		} else {
			if (windowWidth > 1200) {
				root.style.width = 'calc(100% - 30rem)';
			} else {
				root.style.width = '100%';
			}
			desktopSidebar.style.display = 'flex';
		}
	}, [userState, window.innerWidth]);

	useEffect(() => {
		window.addEventListener('resize', () => setWindowWidth(window.innerWidth));
	}, []);

	useEffect(() => {
		let root = document.getElementById('root')!;

		if (mobileSidebarState.show || logOutConfirmationPopUpState.show) {
			root.style.height = '100vh';
			root.style.overflowY = 'hidden';
		} else {
			root.style.height = '100%';
			root.style.overflowY = 'auto';
		}
	}, [mobileSidebarState.show, logOutConfirmationPopUpState.show]);

	return (
		<>
			{User.isLoggedIn() && <HamburgerButton />}
			{User.isLoggedIn() && <DesktopSidebar />}
			{User.isLoggedIn() && <MobileSidebar />}
			{overlayState.show && <Overlay />}
			{alertPopUpState.message && <AlertPopup message={alertPopUpState.message} />}
			{errorPopUpState.message && <ErrorPopup message={errorPopUpState.message} />}
			{emailConfirmationPopUpState.show && <EmailConfirmationPopup />}
			{forgotPasswordPopUpState.show && <ForgotPasswordPopUp />}
			<Routes>
				{!User.isLoggedIn() && (
					<>
						<Route path='/' element={<Homepage />} />
						<Route
							path='/connexion'
							element={
								<LogInForm
									mobile={true}
									switchFormHandler={function (): void {
										throw new Error('Function not implemented.');
									}}
								/>
							}
						/>
						<Route
							path='/inscription'
							element={<SignUpForm mobile={true} />}
						/>
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
						<Route path='/aide' element={<HelpPage />} />
						<Route path='/alimentation' element={<NutritionPage />} />
						<Route path='/sommeil' element={<SleepPage />} />
						<Route path='/sport' element={<SportsPage />} />
						<Route path='/detente' element={<RelaxationPage />} />
						<Route path='/projets' element={<ProjectsPage />} />
						<Route path='/vie-sociale' element={<SocialLifePage />} />
						<Route path='/mentions-legales' element={<LegalNoticePage />} />
					</>
				)}
				<Route path='/contact' element={<Contact />} />
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
