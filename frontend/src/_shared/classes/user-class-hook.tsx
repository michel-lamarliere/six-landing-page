import { useDispatch, useSelector } from 'react-redux';

import { useNavigate } from 'react-router-dom';
import { addHours, isBefore } from 'date-fns';

import { useRequest } from '../hooks/http-hook';
import { useFormatUserName } from '../hooks/format-user-name-hook';

import { UserActionTypes } from '../store/user';
import { RootState } from '../store/_store';
import { EmailConfirmationPopUpActionTypes } from '../store/pop-ups/email-confirmation-pop-up';
import { ErrorPopUpActionTypes } from '../store/pop-ups/error-pop-up';
import { AlertPopUpActionTypes } from '../store/pop-ups/alert-pop-up';

export const useUserClass = () => {
	const dispatch = useDispatch();
	const navigate = useNavigate();

	const { sendRequest } = useRequest();
	const { formatUserName } = useFormatUserName();

	const userState = useSelector((state: RootState) => state.user);

	class User {
		// token: string;
		// id: string;
		// icon: number;
		// name: string;
		// email: string;
		// confirmedEmail: string;

		// constructor(userData: {
		// 	token: string;
		// 	id: string;
		// 	icon: number;
		// 	name: string;
		// 	email: string;
		// 	confirmedEmail: string;
		// }) {
		// 	this.token = userData.token;
		// 	this.id = userData.id;
		// 	this.icon = userData.icon;
		// 	this.name = userData.name;
		// 	this.email = userData.email;
		// 	this.confirmedEmail = userData.confirmedEmail;
		// }

		static rememberEmail(data: { email: string }) {
			localStorage.setItem('rememberEmail', data.email);
		}

		static forgetEmail() {
			localStorage.removeItem('rememberEmail');
		}

		static logIn(data: {
			token: string;
			id: string;
			icon: number;
			name: string;
			email: string;
			confirmedEmail: string;
		}) {
			const tokenExpiration = addHours(new Date(), 1);

			localStorage.setItem(
				'userData',
				JSON.stringify({
					token: data.token,
					tokenExpiration: tokenExpiration,
					id: data.id,
					icon: data.icon,
					name: data.name,
					email: data.email,
					confirmedEmail: data.confirmedEmail,
				})
			);

			dispatch({
				type: UserActionTypes.LOG_USER_IN,
				token: data.token,
				tokenExpiration: tokenExpiration.toISOString(),
				id: data.id,
				icon: data.icon,
				name: formatUserName(data.name),
				email: data.email,
				confirmedEmail: data.confirmedEmail,
			});

			sessionStorage.setItem(
				'showEmailConfirmationPopup',
				JSON.stringify(!data.confirmedEmail)
			);

			if (!data.confirmedEmail) {
				dispatch({
					type: EmailConfirmationPopUpActionTypes.SHOW_EMAIL_CONFIRMATION_POP_UP,
				});
			}

			navigate('/journal/quotidien');
		}

		static autoLogIn() {
			const storedUserData = localStorage.getItem('userData');

			let showEmailConfirmationPopup = sessionStorage.getItem(
				'showEmailConfirmationPopup'
			);

			if (showEmailConfirmationPopup) {
				showEmailConfirmationPopup = JSON.parse(showEmailConfirmationPopup);
			}

			if (!storedUserData) return;

			const userData = JSON.parse(storedUserData);

			if (isBefore(new Date(userData.tokenExpiration), new Date())) {
				dispatch({ type: UserActionTypes.LOG_USER_OUT });
				navigate('/');
				return;
			}

			dispatch({
				type: UserActionTypes.LOG_USER_IN,
				token: userData.token,
				tokenExpiration: userData.tokenExpiration,
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
		}

		static logOut(data: { redirect: boolean }) {
			const { redirect } = data;

			localStorage.removeItem('userData');
			sessionStorage.removeItem('showEmailConfirmationPopup');

			dispatch({ type: UserActionTypes.LOG_USER_OUT });

			dispatch({
				type: EmailConfirmationPopUpActionTypes.HIDE_EMAIL_CONFIRMATION_POP_UP,
			});

			if (redirect) {
				navigate('/');
			}
		}

		static async refreshInfo() {
			const responseData = await sendRequest({
				url: `${process.env.REACT_APP_BACKEND_URL}/user/${userState.id}`,
				method: 'GET',
			});

			if (!responseData) {
				return;
			}

			if (responseData.error) {
				dispatch({
					type: ErrorPopUpActionTypes.SET_AND_SHOW_ERROR_POP_UP,
					message: responseData.message,
				});
				return;
			}

			dispatch({
				type: UserActionTypes.REFRESH_USER_DATA,
				icon: responseData.user.icon,
				name: formatUserName(responseData.user.name),
				email: responseData.user.email,
				confirmedEmail: responseData.user.confirmation.confirmed,
			});

			const userDataString = localStorage.getItem('userData');

			if (userDataString) {
				const userData = JSON.parse(userDataString);
				if (userData) {
					localStorage.setItem(
						'userData',
						JSON.stringify({
							token: userData.token,
							tokenExpiration: userData.tokenExpiration,
							id: userData.id,
							icon: responseData.user.icon,
							name: responseData.user.name,
							email: responseData.user.email,
							confirmedEmail: responseData.user.confirmedEmail,
						})
					);
				}

				sessionStorage.setItem(
					'showEmailConfirmationPopup',
					JSON.stringify(!responseData.user.confirmedEmail)
				);
			}

			return responseData.user;
		}

		static getInfo() {
			return userState;
		}

		static isLoggedIn() {
			if (
				!userState.token ||
				!userState.tokenExpiration ||
				!userState.id ||
				typeof userState.icon !== 'number' ||
				!userState.name ||
				!userState.email ||
				(userState.confirmedEmail !== true && userState.confirmedEmail !== false)
			) {
				return false;
			}
			return true;
		}

		static checkTokenIsExpired() {
			if (!userState.tokenExpiration) {
				return;
			}

			let remainingTime =
				new Date(userState.tokenExpiration).getTime() - new Date().getTime();

			setTimeout(() => {
				dispatch({
					type: AlertPopUpActionTypes.SET_AND_SHOW_ALERT_POP_UP,
					message: 'Votre session a expiré, veuillez vous reconnecter.',
				});

				User.logOut({ redirect: true });
			}, remainingTime);
		}
	}

	return { User };
};
