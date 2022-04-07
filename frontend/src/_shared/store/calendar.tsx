import { Action } from 'redux';

interface State {
	show: boolean;
}

const initialStateReducer: State = {
	show: false,
};

export enum CalendarActionTypes {
	SHOW = 'SHOW',
	HIDE = 'HIDE',
}

const calendarReducer = (state = initialStateReducer, action: Action) => {
	switch (action.type) {
		case CalendarActionTypes.SHOW:
			return { ...state, show: true };

		case CalendarActionTypes.HIDE:
			return { ...state, show: false };

		default:
			return state;
	}
};

export default calendarReducer;
