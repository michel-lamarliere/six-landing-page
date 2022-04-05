import { useDispatch, useSelector } from 'react-redux';

import { useNavigate } from 'react-router-dom';
import { addHours } from 'date-fns';

import { useRequest } from '../hooks/http-hook';

import { PopUpActionTypes } from '../store/pop-ups';
import { UserActionTypes } from '../store/user';
import { RootState } from '../store/_store';

export const useUser = () => {
	const dispatch = useDispatch();
	const navigate = useNavigate();

	const { sendRequest } = useRequest();

	const userState = useSelector((state: RootState) => state.user);

	const loggedInUser = useSelector((state: RootState) => state.user);

	const formatUserName = (name: string) => {
		let formattedName = '';
		if (!name) return;

		if (name.match(/-/)) {
			let part1 = name.split('-')[0];
			part1 = part1.slice(0, 1).toUpperCase() + part1.slice(1);

			let part2 = name.split('-')[1];
			part2 = part2.slice(0, 1).toUpperCase() + part2.slice(1);

			formattedName = `${part1}-${part2}`;
		} else {
			formattedName = name?.slice(0, 1).toUpperCase() + name.slice(1);
		}
		return formattedName;
	};

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
				name: formatUserName(this.name),
				email: this.email,
				confirmedEmail: this.confirmedEmail,
			});

			sessionStorage.setItem(
				'showEmailConfirmationPopup',
				JSON.stringify(!this.confirmedEmail)
			);

			if (!this.confirmedEmail) {
				dispatch({ type: PopUpActionTypes.SHOW_EMAIL_CONFIRMATION });
			}

			navigate('/journal/quotidien');
		}

		static async refreshData() {
			const responseData = await sendRequest(
				`${process.env.REACT_APP_BACKEND_URL}/user/${userState.id}`,
				'GET'
			);

			if (!responseData) {
				return;
			}

			if (responseData.error) {
				dispatch({
					type: PopUpActionTypes.SET_AND_SHOW_ERROR,
					message: responseData.error,
				});
				return;
			}

			dispatch({
				type: UserActionTypes.REFRESH_DATA,
				name: formatUserName(responseData.user.name),
				email: responseData.user.email,
				confirmedEmail: responseData.user.confirmation.confirmed,
			});
		}

		static logOut() {
			dispatch({ type: UserActionTypes.LOG_OUT });
			dispatch({ type: PopUpActionTypes.HIDE_EMAIL_CONFIRMATION });
			navigate('/');
		}

		static displayInfo() {
			return loggedInUser;
		}
	}

	return { User };
};
