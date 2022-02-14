import { Action } from 'redux';

interface State {
	showCalendarOverlay: boolean;
}

const initialStateReducer: State = {
	showCalendarOverlay: false,
};

export enum UIElementsActionTypes {
	TOGGLE_OVERLAY = 'TOGGLE_OVERLAY',
}

const UIReducer = (state = initialStateReducer, action: Action) => {
	switch (action.type) {
		case UIElementsActionTypes.TOGGLE_OVERLAY:
			return { showCalendarOverlay: !state.showCalendarOverlay };
		default:
			return state;
	}
};

export default UIReducer;
