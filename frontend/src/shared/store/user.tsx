interface State {
	token: null | string;
	expiration: any;
	// expiration: Date | null;
	id: null | string;
	name: null | string;
	email: null | string;
	confirmedEmail: boolean | null;
}

interface Action extends State {
	type: UserActionTypes;
}

const initialStateReducer: State = {
	token: null,
	expiration: null,
	id: null,
	name: null,
	email: null,
	confirmedEmail: null,
};

export const enum UserActionTypes {
	LOG_IN = 'LOG_IN',
	LOG_OUT = 'LOG_OUT',
	REFRESH_NAME = 'REFRESH_NAME',
	REFRESH_DATA = 'REFRESH_DATA',
}

const userReducer = (state = initialStateReducer, action: Action) => {
	switch (action.type) {
		case UserActionTypes.LOG_IN: {
			localStorage.setItem(
				'userData',
				JSON.stringify({
					token: action.token,
					expiration: action.expiration,
					id: action.id,
					name: action.name,
					email: action.email,
					confirmedEmail: action.confirmedEmail,
				})
			);

			sessionStorage.setItem(
				'showEmailConfirmationPopup',
				JSON.stringify(!action.confirmedEmail)
			);

			return {
				token: action.token,
				expiration: action.expiration,
				id: action.id,
				name: action.name,
				email: action.email,
				confirmedEmail: action.confirmedEmail,
			};
		}

		case UserActionTypes.LOG_OUT: {
			localStorage.removeItem('userData');
			sessionStorage.removeItem('showEmailConfirmationPopup');

			return {
				token: null,
				expiration: null,
				id: null,
				name: null,
				email: null,
				confirmedEmail: null,
			};
		}

		case UserActionTypes.REFRESH_NAME:
			return { ...state, name: action.name };

		case UserActionTypes.REFRESH_DATA: {
			localStorage.setItem(
				'userData',
				JSON.stringify({
					token: state.token,
					expiration: state.expiration,
					id: state.id,
					name: action.name,
					email: action.email,
					confirmedEmail: action.confirmedEmail,
				})
			);

			sessionStorage.setItem(
				'showEmailConfirmationPopup',
				JSON.stringify(!action.confirmedEmail)
			);
			return { ...state, name: action.name, confirmedEmail: action.confirmedEmail };
		}

		default:
			return state;
	}
};

export default userReducer;
