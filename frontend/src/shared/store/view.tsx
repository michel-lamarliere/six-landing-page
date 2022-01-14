interface State {
	view: string;
}

const initialStateReducer: State = {
	view: 'DAILY-VIEW',
};

interface Action extends State {
	type: 'DAILY-VIEW' | 'WEEKLY-VIEW' | 'MONTHLY-VIEW';
	login: any;
	payload: any;
}

const setLocalStorage = (type: string) => {
	localStorage.setItem('log-view', type);
};

const viewReducer = (state = initialStateReducer, action: Action) => {
	switch (action.type) {
		case 'DAILY-VIEW':
			setLocalStorage(action.type);
			return { view: 'DAILY-VIEW' };
		case 'WEEKLY-VIEW':
			setLocalStorage(action.type);
			return { view: 'WEEKLY-VIEW' };
		case 'MONTHLY-VIEW':
			setLocalStorage(action.type);
			return { view: 'MONTHLY-VIEW' };
		default:
			return state;
	}
};

export default viewReducer;
