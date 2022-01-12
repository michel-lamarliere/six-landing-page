interface State {
	view: string;
}

const initialStateReducer: State = {
	view: 'DAILY',
};

interface Action extends State {
	type: 'DAILY' | 'WEEKLY' | 'MONTHLY';
	login: any;
	payload: any;
}

const setLocalStorage = (type: string) => {
	localStorage.setItem('log-view', type);
};

const viewReducer = (state = initialStateReducer, action: Action) => {
	switch (action.type) {
		case 'DAILY':
			setLocalStorage(action.type);
			return { view: 'DAILY' };
		case 'WEEKLY':
			setLocalStorage(action.type);
			return { view: 'WEEKLY' };
		case 'MONTHLY':
			setLocalStorage(action.type);
			return { view: 'MONTHLY' };
		default:
			return state;
	}
};

export default viewReducer;
