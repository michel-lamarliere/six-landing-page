import { Action } from 'redux';

interface State {
	showCalendarOverlay: boolean;
	showCalendar: boolean;
	showTaskSelector: boolean;
}

const initialStateReducer: State = {
	showCalendarOverlay: false,
	showCalendar: false,
	showTaskSelector: false,
};

export enum UIElementsActionTypes {
	SHOW_OVERLAY = 'SHOW_OVERLAY',
	HIDE_OVERLAY = 'HIDE_OVERLAY',

	SHOW_CALENDAR = 'SHOW_CALENDAR',
	HIDE_CALENDAR = 'HIDE_CALENDAR',

	SHOW_TASK_SELECTOR = 'SHOW_TASK_SELECTOR',
	HIDE_TASK_SELECTOR = 'HIDE_TASK_SELECTOR',
}

const UIReducer = (state = initialStateReducer, action: Action) => {
	switch (action.type) {
		// OVERLAY
		case UIElementsActionTypes.SHOW_OVERLAY:
			return { ...state, showCalendarOverlay: true };
		case UIElementsActionTypes.HIDE_OVERLAY:
			return { ...state, showCalendarOverlay: false };
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
