interface State {
	message: null | string;
}

interface Action {
	type: 'SET_ERROR' | 'REMOVE_ERROR';
	message: string;
}

const initialStateReducer: State = {
	message: null,
};

const ErrorReducer = (state = initialStateReducer, action: Action) => {
	switch (action.type) {
		case 'SET_ERROR': {
			return {
				message: action.message,
			};
		}
		case 'REMOVE_ERROR': {
			return {
				message: null,
			};
		}
		default:
			return state;
	}
};

export default ErrorReducer;
