import { createStore, combineReducers } from 'redux';
import userReducer from './user';
import uiElementsReducer from './ui-elements';
import popUpsReducer from './pop-ups';

const rootReducer = combineReducers({
	user: userReducer,
	uiElements: uiElementsReducer,
	popUps: popUpsReducer,
});

const store = createStore(rootReducer);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store;

export default store;
