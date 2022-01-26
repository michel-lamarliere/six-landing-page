interface State {
	show: boolean;
}

const initialState: State = {
	show: false,
};

interface Action {
	type: 'SHOW' | 'HIDE';
}

const emailReducer = (state = initialState, action: Action) => {
	switch (action.type) {
		case 'SHOW': {
			return { show: true };
		}
		case 'HIDE': {
			sessionStorage.removeItem('confirmedEmail');
			return { show: false };
		}
		default:
			return { show: state.show };
	}
};

export default emailReducer;
