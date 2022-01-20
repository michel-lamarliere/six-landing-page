type StringOrNull = null | string;

interface State {
	token: StringOrNull;
	expiration: any;
	// expiration: Date | null;
	id: StringOrNull;
	name: StringOrNull;
	email: StringOrNull;
}

const initialStateReducer: State = {
	token: null,
	expiration: null,
	id: null,
	name: null,
	email: null,
};

interface Action extends State {
	type: 'LOG_IN' | 'LOG_OUT' | 'CHANGE_NAME';
	login: any;
}

const userReducer = (state = initialStateReducer, action: Action) => {
	switch (action.type) {
		case 'LOG_IN':
			return {
				token: action.token,
				expiration: action.expiration,
				id: action.id,
				name: action.name,
				email: action.email,
			};
		case 'LOG_OUT':
			return {
				token: null,
				expiration: null,
				id: null,
				name: null,
				email: null,
			};
		case 'CHANGE_NAME':
			return { ...state, name: action.name };
		default:
			return state;
	}
};

export default userReducer;
