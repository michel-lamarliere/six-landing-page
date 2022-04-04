interface State {
	// IF ERROR !== NULL, ERROR MESSAGE IS DISPLAYED
	errorMessage: null | string;
	showEmailConfirmation: boolean;
}

interface Action {
	type: PopUpActionTypes;
	message: string;
}

const initialStateReducer: State = {
	errorMessage: null,
	showEmailConfirmation: false,
};

export const enum PopUpActionTypes {
	SET_AND_SHOW_ERROR = 'SET_ERROR',
	REMOVE_ERROR = 'REMOVE_ERROR',

	SHOW_EMAIL_CONFIRMATION = 'SHOW_EMAIL_CONFIRMATION',
	HIDE_EMAIL_CONFIRMATION = 'HIDE_EMAIL_CONFIRMATION',
}

const popUpsReducer = (state = initialStateReducer, action: Action) => {
	switch (action.type) {
		// ERROR
		case PopUpActionTypes.SET_AND_SHOW_ERROR: {
			return {
				...state,
				errorMessage: action.message,
			};
		}

		case PopUpActionTypes.REMOVE_ERROR: {
			return {
				...state,
				errorMessage: null,
			};
		}
		// EMAIL CONFIRMATION
		case PopUpActionTypes.SHOW_EMAIL_CONFIRMATION: {
			return { ...state, showEmailConfirmation: true };
		}

		case PopUpActionTypes.HIDE_EMAIL_CONFIRMATION: {
			return { ...state, showEmailConfirmation: false };
		}

		default:
			return state;
	}
};

export default popUpsReducer;
