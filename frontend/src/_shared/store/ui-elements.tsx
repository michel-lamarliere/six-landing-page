import { Action } from 'redux';

interface State {
	showOverlay: boolean;
	showForgotPasswordForm: boolean;
	showCalendar: boolean;
	showTaskSelector: boolean;
}

const initialStateReducer: State = {
	showOverlay: false,
	showForgotPasswordForm: false,
	showCalendar: false,
	showTaskSelector: false,
};

export enum UIElementsActionTypes {
	SHOW_OVERLAY = 'SHOW_OVERLAY',
	HIDE_OVERLAY = 'HIDE_OVERLAY',

	SHOW_FORGOT_PASSWORD_FORM = 'SHOW_FORGOT_PASSWORD_FORM',
	HIDE_FORGOT_PASSWORD_FORM = 'HIDE_FORGOT_PASSWORD_FORM',

	SHOW_CALENDAR = 'SHOW_CALENDAR',
	HIDE_CALENDAR = 'HIDE_CALENDAR',

	SHOW_TASK_SELECTOR = 'SHOW_TASK_SELECTOR',
	HIDE_TASK_SELECTOR = 'HIDE_TASK_SELECTOR',
}

const UIReducer = (state = initialStateReducer, action: Action) => {
	switch (action.type) {
		// OVERLAY
		case UIElementsActionTypes.SHOW_OVERLAY:
			return { ...state, showOverlay: true };
		case UIElementsActionTypes.HIDE_OVERLAY:
			return { ...state, showOverlay: false };
		// FORGOT PASSWORD FORM
		case UIElementsActionTypes.SHOW_FORGOT_PASSWORD_FORM:
			return { ...state, showForgotPasswordForm: true };
		case UIElementsActionTypes.HIDE_FORGOT_PASSWORD_FORM:
			return { ...state, showForgotPasswordForm: false };
		// CALENDAR
		case UIElementsActionTypes.SHOW_CALENDAR:
			return { ...state, showCalendar: true };
		case UIElementsActionTypes.HIDE_CALENDAR:
			return { ...state, showCalendar: false };
		// TASK SELECTOR
		case UIElementsActionTypes.SHOW_TASK_SELECTOR:
			return { ...state, showTaskSelector: true };
		case UIElementsActionTypes.HIDE_TASK_SELECTOR:
			return { ...state, showTaskSelector: false };
		default:
			return state;
	}
};

export default UIReducer;
