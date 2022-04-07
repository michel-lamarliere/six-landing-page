import { Action } from 'redux';

interface State {
	show: boolean;
}

const initialStateReducer: State = {
	show: false,
};

export enum MobileSidebarActionTypes {
	SHOW = 'SHOW',
	HIDE = 'HIDE',
}

const mobileSidebarReducer = (state = initialStateReducer, action: Action) => {
	switch (action.type) {
		case MobileSidebarActionTypes.SHOW:
			return { ...state, show: true };

		case MobileSidebarActionTypes.HIDE:
			return { ...state, show: false };

		default:
			return state;
	}
};

export default mobileSidebarReducer;
