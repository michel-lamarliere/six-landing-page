import { Action } from 'redux';

interface State {
	show: boolean;
}

const initialState: State = {
	show: false,
};

export enum LogOutConfirmationPopUpActionTypes {
	SHOW_LOG_OUT_CONFIRMATION_POP_UP = 'SHOW_LOG_OUT_CONFIRMATION_POP_UP',
	HIDE_LOG_OUT_CONFIRMATION_POP_UP = 'HIDE_LOG_OUT_CONFIRMATION_POP_UP',
}

const logOutConfirmationPopUpReducer = (state = initialState, action: Action) => {
	switch (action.type) {
		case LogOutConfirmationPopUpActionTypes.SHOW_LOG_OUT_CONFIRMATION_POP_UP:
			return { show: true };

		case LogOutConfirmationPopUpActionTypes.HIDE_LOG_OUT_CONFIRMATION_POP_UP:
			return { show: false };

		default:
			return state;
	}
};

export default logOutConfirmationPopUpReducer;
