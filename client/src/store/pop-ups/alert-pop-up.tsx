interface State {
	message: null | string;
}

interface Action {
	type: AlertPopUpActionTypes;
	message: string;
}

const initialState: State = {
	message: null,
};

export const enum AlertPopUpActionTypes {
	SET_AND_SHOW_ALERT_POP_UP = 'SET_AND_SHOW_ALERT_POP_UP',
	REMOVE_AND_HIDE_ALERT_POP_UP = 'REMOVE_AND_HIDE_ALERT_POP_UP',
}

const alertPopUpReducer = (state = initialState, action: Action) => {
	switch (action.type) {
		case AlertPopUpActionTypes.SET_AND_SHOW_ALERT_POP_UP: {
			return {
				message: action.message,
			};
		}

		case AlertPopUpActionTypes.REMOVE_AND_HIDE_ALERT_POP_UP: {
			return {
				message: null,
			};
		}

		default:
			return state;
	}
};

export default alertPopUpReducer;
