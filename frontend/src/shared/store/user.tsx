type StringOrNull = null | string;

interface State {
	token: StringOrNull;
	expiration: any;
	// expiration: Date | null;
	id: StringOrNull;
	name: StringOrNull;
	email: StringOrNull;
	confirmedEmail: boolean | null;
}

const initialStateReducer: State = {
	token: null,
	expiration: null,
	id: null,
	name: null,
	email: null,
	confirmedEmail: null,
};

// interface Action extends State {
// 	// type: 'LOG_IN' | 'LOG_OUT' | 'CHANGE_NAME';
// 	type: ActionType;
// 	login: any;
// }

interface Action extends State {
	type: 'LOG_IN' | 'LOG_OUT' | 'CHANGE_NAME';
	login: any;
}

// enum ActionType {
// 	LogIn = 'LOG_IN',
// 	LogOut = 'LOG_OUT',
// 	ChangeName = 'CHANGE_NAME',
// }

const userReducer = (state = initialStateReducer, action: Action) => {
	switch (action.type) {
		// case ActionType.LogIn
		case 'LOG_IN':
			return {
				token: action.token,
				expiration: action.expiration,
				id: action.id,
				name: action.name,
				email: action.email,
				confirmedEmail: action.confirmedEmail,
			};
		// case ActionType.Logout:
		case 'LOG_OUT':
			return {
				token: null,
				expiration: null,
				id: null,
				name: null,
				email: null,
				confirmedEmail: null,
			};
		case 'CHANGE_NAME':
			return { ...state, name: action.name };
		default:
			return state;
	}
};

export default userReducer;
