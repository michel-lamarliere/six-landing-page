import { Action } from 'redux';

interface State {
	show: boolean;
}

const initialStateReducer: State = {
	show: false,
};

export enum ForgotPasswordPopUpActionTypes {
	SHOW = 'SHOW',
	HIDE = 'HIDE',
}

const forgotPasswordPopUpReducer = (state = initialStateReducer, action: Action) => {
	switch (action.type) {
		case ForgotPasswordPopUpActionTypes.SHOW:
			return { ...state, show: true };

		case ForgotPasswordPopUpActionTypes.HIDE:
			return { ...state, show: false };

		default:
			return state;
	}
};

export default forgotPasswordPopUpReducer;
