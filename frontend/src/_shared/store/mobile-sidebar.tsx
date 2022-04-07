import { Action } from 'redux';

interface State {
	show: boolean;
}

const initialStateReducer: State = {
	show: false,
};

export enum MobileSidebarActionTypes {
	SHOW_MOBILE_SIDEBAR = 'SHOW_MOBILE_SIDEBAR',
	HIDE_MOBILE_SIDEBAR = 'HIDE_MOBILE_SIDEBAR',
}

const mobileSidebarReducer = (state = initialStateReducer, action: Action) => {
	switch (action.type) {
		case MobileSidebarActionTypes.SHOW_MOBILE_SIDEBAR:
			return { show: true };

		case MobileSidebarActionTypes.HIDE_MOBILE_SIDEBAR:
			return { show: false };

		default:
			return state;
	}
};

export default mobileSidebarReducer;
