interface State {
	message: null | string;
}

interface Action {
	type: ErrorPopUpActionTypes;
	message: string;
}

const initialStateReducer: State = {
	message: null,
};

export const enum ErrorPopUpActionTypes {
	SET_AND_SHOW_ERROR_POP_UP = 'SET_AND_SHOW_ERROR_POP_UP',
	REMOVE_AND_HIDE_ERROR_POP_UP = 'REMOVE_AND_HIDE_ERROR_POP_UP',
}

const errorPopUpReducer = (state = initialStateReducer, action: Action) => {
	switch (action.type) {
		case ErrorPopUpActionTypes.SET_AND_SHOW_ERROR_POP_UP: {
			return {
				message: action.message,
			};
		}

		case ErrorPopUpActionTypes.REMOVE_AND_HIDE_ERROR_POP_UP: {
			return {
				message: null,
			};
		}

		default:
			return state;
	}
};

export default errorPopUpReducer;
