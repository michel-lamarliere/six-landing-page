interface State {
	message: null | string;
}

interface Action {
	type: AlertPopUpActionTypes;
	message: string;
}

const initialStateReducer: State = {
	message: null,
};

export const enum AlertPopUpActionTypes {
	SET_AND_SHOW = 'SET_AND_SHOW',
	REMOVE_AND_HIDE = 'REMOVE_AND_HIDE',
}

const alertPopUpReducer = (state = initialStateReducer, action: Action) => {
	switch (action.type) {
		case AlertPopUpActionTypes.SET_AND_SHOW: {
			return {
				...state,
				message: action.message,
			};
		}

		case AlertPopUpActionTypes.REMOVE_AND_HIDE: {
			return {
				...state,
				message: null,
			};
		}

		default:
			return state;
	}
};

export default alertPopUpReducer;
