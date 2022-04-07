import { Action } from 'redux';

interface State {
	show: boolean;
}

const initialStateReducer: State = {
	show: false,
};

export enum OverlayActionTypes {
	SHOW = 'SHOW',
	HIDE = 'HIDE',
}

const overlayReducer = (state = initialStateReducer, action: Action) => {
	switch (action.type) {
		case OverlayActionTypes.SHOW:
			return { ...state, show: true };

		case OverlayActionTypes.HIDE:
			return { ...state, show: false };

		default:
			return state;
	}
};

export default overlayReducer;
