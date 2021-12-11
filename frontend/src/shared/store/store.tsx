import { createStore } from 'redux';

type StringOrNull = null | string;

interface State {
	isLoggedIn: boolean;
	id: StringOrNull;
	name: StringOrNull;
	email: StringOrNull;
}

const initialStateReducer: State = {
	isLoggedIn: false,
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

const login = (isLoggedIn: boolean, id: string, name: string, email: string) => {
	return {
		type: LOG_IN,
		isLoggedIn,
		id,
		name,
		email,
	};
};

const storeReducer = (state = initialStateReducer, action: Action) => {
	switch (action.type) {
		case LOG_IN:
			return {
				isLoggedIn: action.isLoggedIn,
				id: action.id,
				name: action.name,
				email: action.email,
			};
		case 'LOG_OUT':
			return {
				isLoggedIn: false,
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
