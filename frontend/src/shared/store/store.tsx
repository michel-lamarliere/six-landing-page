import { createStore, combineReducers } from 'redux';
import userReducer from './user';
import viewReducer from './view';
import errorReducer from './error';

const rootReducer = combineReducers({
	user: userReducer,
	view: viewReducer,
	error: errorReducer,
});

const store = createStore(rootReducer);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store;

export default store;
