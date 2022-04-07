interface State {
	show: boolean;
}

interface Action {
	type: EmailConfirmationPopUpActionTypes;
}

const initialStateReducer: State = {
	show: false,
};

export const enum EmailConfirmationPopUpActionTypes {
	SHOW_EMAIL_CONFIRMATION_POP_UP = 'SHOW_EMAIL_CONFIRMATION_POP_UP',
	HIDE_EMAIL_CONFIRMATION_POP_UP = 'HIDE_EMAIL_CONFIRMATION_POP_UP',
}

const emailConfirmationPopUpReducer = (state = initialStateReducer, action: Action) => {
	switch (action.type) {
		case EmailConfirmationPopUpActionTypes.SHOW_EMAIL_CONFIRMATION_POP_UP: {
			return { show: true };
		}

		case EmailConfirmationPopUpActionTypes.HIDE_EMAIL_CONFIRMATION_POP_UP: {
			return { show: false };
		}

		default:
			return state;
	}
};

export default emailConfirmationPopUpReducer;
