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
	SHOW = 'SHOW',
	HIDE = 'HIDE',
}

const emailConfirmationPopUpReducer = (state = initialStateReducer, action: Action) => {
	switch (action.type) {
		case EmailConfirmationPopUpActionTypes.SHOW: {
			return { ...state, show: true };
		}

		case EmailConfirmationPopUpActionTypes.HIDE: {
			return { ...state, show: false };
		}

		default:
			return state;
	}
};

export default emailConfirmationPopUpReducer;
