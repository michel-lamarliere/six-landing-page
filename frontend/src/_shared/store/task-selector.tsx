import { Action } from 'redux';

interface State {
	show: boolean;
}

const initialStateReducer: State = {
	show: false,
};

export enum TaskSelectorActionTypes {
	SHOW = 'SHOW',
	HIDE = 'HIDE',
}

const taskSelectorReducer = (state = initialStateReducer, action: Action) => {
	switch (action.type) {
		case TaskSelectorActionTypes.SHOW:
			return { ...state, show: true };

		case TaskSelectorActionTypes.HIDE:
			return { ...state, show: false };

		default:
			return state;
	}
};

export default taskSelectorReducer;
