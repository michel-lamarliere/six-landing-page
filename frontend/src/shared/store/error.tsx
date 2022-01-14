interface State {
	message: null | string;
}

interface Action {
	type: 'SET-ERROR' | 'REMOVE-ERROR';
	message: string;
}

const initialStateReducer: State = {
	message: null,
};

const ErrorReducer = (state = initialStateReducer, action: Action) => {
	switch (action.type) {
		case 'SET-ERROR': {
			return {
				message: action.message,
			};
		}
		case 'REMOVE-ERROR': {
			return {
				message: null,
			};
		}
		default:
			return state;
	}
};

export default ErrorReducer;
