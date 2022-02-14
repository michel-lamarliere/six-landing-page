import { createStore, combineReducers } from 'redux';
import userReducer from './user';
import errorReducer from './error';
import emailReducer from './email-confirmation';
import uiElementsReducer from './ui-elements';

const rootReducer = combineReducers({
	user: userReducer,
	error: errorReducer,
	email: emailReducer,
	uiElements: uiElementsReducer,
});

const store = createStore(rootReducer);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store;

export default store;
