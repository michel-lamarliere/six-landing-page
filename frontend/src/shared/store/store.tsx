import { createStore } from 'redux';

type StringOrNull = null | string;

interface State {
	token: StringOrNull;
	id: StringOrNull;
	name: StringOrNull;
	email: StringOrNull;
}

const initialStateReducer: State = {
	token: null,
	id: null,
	name: null,
	email: null,
};

interface Action extends State {
	type: 'LOG_IN' | 'LOG_OUT';
	login: any;
	payload: any;
}

const LOG_IN = 'LOG_IN';
const LOG_OUT = 'LOG_OUT';

const login = (token: string, id: string, name: string, email: string) => {
	return {
		type: LOG_IN,
		token,
		id,
		name,
		email,
	};
};

const storeReducer = (state = initialStateReducer, action: Action) => {
	switch (action.type) {
		case LOG_IN:
			return {
				token: action.token,
				id: action.id,
				name: action.name,
				email: action.email,
			};
		case LOG_OUT:
			return {
				token: null,
				id: null,
				name: null,
				email: null,
			};
		default:
			return state;
	}
};

const store = createStore(storeReducer);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;
