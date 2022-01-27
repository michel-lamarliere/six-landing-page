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
	CHANGE_NAME = 'CHANGE_NAME',
}

const userReducer = (state = initialStateReducer, action: Action) => {
	switch (action.type) {
		case UserActionTypes.LOG_IN:
			return {
				token: action.token,
				expiration: action.expiration,
				id: action.id,
				name: action.name,
				email: action.email,
				confirmedEmail: action.confirmedEmail,
			};
		case UserActionTypes.LOG_OUT:
			return {
				token: null,
				expiration: null,
				id: null,
				name: null,
				email: null,
				confirmedEmail: null,
			};
		case UserActionTypes.CHANGE_NAME:
			return { ...state, name: action.name };
		default:
			return state;
	}
};

export default userReducer;
