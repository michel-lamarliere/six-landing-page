import { Action } from 'redux';

interface State {
	show: boolean;
}

const initialState: State = {
	show: false,
};

export enum CalendarActionTypes {
	SHOW_CALENDAR = 'SHOW_CALENDAR',
	HIDE_CALENDAR = 'HIDE_CALENDAR',
}

const calendarReducer = (state = initialState, action: Action) => {
	switch (action.type) {
		case CalendarActionTypes.SHOW_CALENDAR:
			return { show: true };

		case CalendarActionTypes.HIDE_CALENDAR:
			return { show: false };

		default:
			return state;
	}
};

export default calendarReducer;
