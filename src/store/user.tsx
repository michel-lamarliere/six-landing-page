interface State {
	token: null | string;
	tokenExpiration: null | Date;
	id: null | string;
	icon: null | number;
	name: null | string;
	email: null | string;
	confirmedEmail: boolean | null;
}

interface Action extends State {
	type: UserActionTypes;
}

const initialState: State = {
	token: null,
	tokenExpiration: null,
	id: null,
	icon: null,
	name: null,
	email: null,
	confirmedEmail: null,
};

export const enum UserActionTypes {
	LOG_USER_IN = 'LOG_USER_IN',
	LOG_USER_OUT = 'LOG_USER_OUT',
	REFRESH_USER_DATA = 'REFRESH_USER_DATA',
}

const userReducer = (state = initialState, action: Action) => {
	switch (action.type) {
		case UserActionTypes.LOG_USER_IN: {
			return {
				token: action.token,
				tokenExpiration: action.tokenExpiration,
				id: action.id,
				icon: action.icon,
				name: action.name,
				email: action.email,
				confirmedEmail: action.confirmedEmail,
			};
		}

		case UserActionTypes.LOG_USER_OUT: {
			return {
				token: null,
				tokenExpiration: null,
				id: null,
				icon: null,
				name: null,
				email: null,
				confirmedEmail: null,
			};
		}

		case UserActionTypes.REFRESH_USER_DATA: {
			return {
				...state,
				icon: action.icon,
				name: action.name,
				email: action.email,
				confirmedEmail: action.confirmedEmail,
			};
		}

		default:
			return state;
	}
};

export default userReducer;
