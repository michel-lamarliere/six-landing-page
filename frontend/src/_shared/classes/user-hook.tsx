import { useDispatch, useSelector } from 'react-redux';

import { useNavigate } from 'react-router-dom';
import { addHours } from 'date-fns';

import { EmailConfirmationActionTypes } from '../store/email-confirmation';
import { UserActionTypes } from '../store/user';
import { RootState } from '../store/store';

export const useUser = () => {
	const dispatch = useDispatch();
	const navigate = useNavigate();

	const loggedInUser = useSelector((state: RootState) => state.user);

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

			navigate('/journal/quotidien');
		}

		static logOut() {
			dispatch({ type: UserActionTypes.LOG_OUT });
			dispatch({ type: EmailConfirmationActionTypes.HIDE });
			navigate('/');
		}

		static displayInfo() {
			return loggedInUser;
		}
	}

	return { User };
};
