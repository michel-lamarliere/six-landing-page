import { useDispatch } from 'react-redux';

import { addHours } from 'date-fns';

import { EmailConfirmationActionTypes } from '../store/email-confirmation';
import { UserActionTypes } from '../store/user';

export const useUser = () => {
	const dispatch = useDispatch();

	class User {
		token: any;
		id: any;
		name: any;
		email: any;
		confirmedEmail: any;

		constructor(userData: any) {
			this.token = userData.token;
			this.id = userData.id;
			this.name = userData.name;
			this.email = userData.email;
			this.confirmedEmail = userData.confirmedEmail;
		}

		rememberEmail() {
			localStorage.setItem('rememberEmail', this.email);
		}

		forgetEmail() {
			localStorage.removeItem('rememberEmail');
		}

		logIn() {
			const tokenExpiration = addHours(new Date(), 1);

			dispatch({
				type: UserActionTypes.LOG_IN,
				token: this.token,
				expiration: tokenExpiration.toISOString(),
				id: this.id,
				name: this.name,
				email: this.email,
				confirmedEmail: this.confirmedEmail,
			});

			sessionStorage.setItem(
				'showEmailConfirmationPopup',
				JSON.stringify(!this.confirmedEmail)
			);

			if (!this.confirmedEmail) {
				dispatch({ type: EmailConfirmationActionTypes.SHOW });
			}
		}

		// 	dispatch({
		// 		type: UserActionTypes.LOG_IN,
		// 		token: token,
		// 		expiration: tokenExpiration.toISOString(),
		// 		id: id,
		// 		name: name,
		// 		email: email,
		// 		confirmedEmail: confirmedEmail,
		// 	});
	}

	return { User };
};
