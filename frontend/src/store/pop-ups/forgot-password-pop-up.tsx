import { Action } from 'redux';

interface State {
	show: boolean;
}

const initialStateReducer: State = {
	show: false,
};

export enum ForgotPasswordPopUpActionTypes {
	SHOW_FORGOT_PASSWORD_POP_UP = 'SHOW_FORGOT_PASSWORD_POP_UP',
	HIDE_FORGOT_PASSWORD_POP_UP = 'HIDE_FORGOT_PASSWORD_POP_UP',
}

const forgotPasswordPopUpReducer = (state = initialStateReducer, action: Action) => {
	switch (action.type) {
		case ForgotPasswordPopUpActionTypes.SHOW_FORGOT_PASSWORD_POP_UP:
			return { show: true };

		case ForgotPasswordPopUpActionTypes.HIDE_FORGOT_PASSWORD_POP_UP:
			return { show: false };

		default:
			return state;
	}
};

export default forgotPasswordPopUpReducer;
