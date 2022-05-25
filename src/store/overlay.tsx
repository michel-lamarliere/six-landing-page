import { Action } from 'redux';

interface State {
	show: boolean;
}

const initialState: State = {
	show: false,
};

export enum OverlayActionTypes {
	SHOW_OVERLAY = 'SHOW_OVERLAY',
	HIDE_OVERLAY = 'HIDE_OVERLAY',
}

const overlayReducer = (state = initialState, action: Action) => {
	switch (action.type) {
		case OverlayActionTypes.SHOW_OVERLAY:
			return { show: true };

		case OverlayActionTypes.HIDE_OVERLAY:
			return { show: false };

		default:
			return state;
	}
};

export default overlayReducer;
