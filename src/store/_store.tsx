import { createStore, combineReducers } from 'redux';

import userReducer from './user';
import overlayReducer from './overlay';
import mobileSidebarReducer from './mobile-sidebar';
import calendarReducer from './calendar';
import taskSelectorReducer from './task-selector';
import alertPopUpReducer from './pop-ups/alert-pop-up';
import errorPopUpReducer from './pop-ups/error-pop-up';
import emailConfirmationPopUpReducer from './pop-ups/email-confirmation-pop-up';
import forgotPasswordPopUpReducer from './pop-ups/forgot-password-pop-up';
import logOutConfirmationPopUpReducer from './pop-ups/log-out-confirmation-pop-up';

const rootReducer = combineReducers({
	user: userReducer,
	overlay: overlayReducer,
	mobileSidebar: mobileSidebarReducer,
	calendar: calendarReducer,
	taskSelector: taskSelectorReducer,
	alertPopUp: alertPopUpReducer,
	errorPopUp: errorPopUpReducer,
	emailConfirmationPopUp: emailConfirmationPopUpReducer,
	forgotPasswordPopUp: forgotPasswordPopUpReducer,
	logOutConfirmationPopUp: logOutConfirmationPopUpReducer,
});

const store = createStore(rootReducer);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store;

export default store;
