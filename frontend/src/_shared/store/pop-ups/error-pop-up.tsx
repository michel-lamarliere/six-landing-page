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
	SET_AND_SHOW = 'SET_AND_SHOW',
	REMOVE_AND_HIDE = 'REMOVE_AND_HIDE',
}

const errorPopUpReducer = (state = initialStateReducer, action: Action) => {
	switch (action.type) {
		case ErrorPopUpActionTypes.SET_AND_SHOW: {
			return {
				...state,
				message: action.message,
			};
		}

		case ErrorPopUpActionTypes.REMOVE_AND_HIDE: {
			return {
				...state,
				message: null,
			};
		}

		default:
			return state;
	}
};

export default errorPopUpReducer;
