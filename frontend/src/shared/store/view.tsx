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

const viewReducer = (state = initialStateReducer, action: Action) => {
	switch (action.type) {
		case 'DAILY':
			return { view: 'DAILY' };
		case 'WEEKLY':
			return { view: 'WEEKLY' };
		case 'MONTHLY':
			return { view: 'MONTHLY' };
		default:
			return state;
	}
};

export default viewReducer;
