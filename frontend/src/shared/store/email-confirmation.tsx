interface State {
	show: boolean;
}

interface Action extends State {
	type: EmailConfirmationActionTypes;
}

const initialState: State = {
	show: false,
};

export const enum EmailConfirmationActionTypes {
	SHOW = 'SHOW_EMAIL_CONFIRMATION_POPUP',
	HIDE = 'HIDE_EMAIL_CONFIRMATION_POPUP',
}

const emailReducer = (state = initialState, action: Action) => {
	switch (action.type) {
		case EmailConfirmationActionTypes.SHOW: {
			return { show: true };
		}
		case EmailConfirmationActionTypes.HIDE: {
			sessionStorage.removeItem('confirmedEmail');
			return { show: false };
		}
		default:
			return { show: state.show };
	}
};

export default emailReducer;
