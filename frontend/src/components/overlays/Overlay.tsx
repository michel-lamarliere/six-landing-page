import React, { useEffect } from 'react';
import ReactDOM from 'react-dom';
import { useDispatch, useSelector } from 'react-redux';

import { RootState } from '../../store/_store';
import { OverlayActionTypes } from '../../store/overlay';
import { CalendarActionTypes } from '../../store/calendar';
import { TaskSelectorActionTypes } from '../../store/task-selector';
import { MobileSidebarActionTypes } from '../../store/mobile-sidebar';
import { ErrorPopUpActionTypes } from '../../store/pop-ups/error-pop-up';
import { AlertPopUpActionTypes } from '../../store/pop-ups/alert-pop-up';
import { LogOutConfirmationPopUpActionTypes } from '../../store/pop-ups/log-out-confirmation-pop-up';
import { EmailConfirmationPopUpActionTypes } from '../../store/pop-ups/email-confirmation-pop-up';
import { ForgotPasswordPopUpActionTypes } from '../../store/pop-ups/forgot-password-pop-up';

import classes from './Overlay.module.scss';

const Overlay: React.FC = () => {
	const dispatch = useDispatch();

	// const overlayState = useSelector((state: RootState) => state.overlay);
	const calendarState = useSelector((state: RootState) => state.calendar);
	const taskSelectorState = useSelector((state: RootState) => state.taskSelector);
	const mobileSidebarState = useSelector((state: RootState) => state.mobileSidebar);
	const alertPopUpState = useSelector((state: RootState) => state.alertPopUp);
	const errorPopUpState = useSelector((state: RootState) => state.errorPopUp);
	const emailConfirmationPopUpState = useSelector(
		(state: RootState) => state.emailConfirmationPopUp
	);
	const forgotPasswordPopUpState = useSelector(
		(state: RootState) => state.forgotPasswordPopUp
	);
	const logOutConfirmationPopUpState = useSelector(
		(state: RootState) => state.logOutConfirmationPopUp
	);

	const hideOverlay = () => {
		dispatch({ type: OverlayActionTypes.HIDE_OVERLAY });

		if (calendarState.show) {
			dispatch({ type: CalendarActionTypes.HIDE_CALENDAR });
		}

		if (taskSelectorState.show) {
			dispatch({ type: TaskSelectorActionTypes.HIDE_TASK_SELECTOR });
		}

		if (mobileSidebarState.show) {
			dispatch({ type: MobileSidebarActionTypes.HIDE_MOBILE_SIDEBAR });
		}

		if (alertPopUpState.message) {
			dispatch({ type: AlertPopUpActionTypes.REMOVE_AND_HIDE_ALERT_POP_UP });
		}

		if (errorPopUpState.message) {
			dispatch({ type: ErrorPopUpActionTypes.REMOVE_AND_HIDE_ERROR_POP_UP });
		}

		if (emailConfirmationPopUpState.show) {
			dispatch({
				type: EmailConfirmationPopUpActionTypes.HIDE_EMAIL_CONFIRMATION_POP_UP,
			});
		}

		if (forgotPasswordPopUpState.show) {
			dispatch({
				type: ForgotPasswordPopUpActionTypes.HIDE_FORGOT_PASSWORD_POP_UP,
			});
		}

		if (logOutConfirmationPopUpState.show) {
			dispatch({
				type: LogOutConfirmationPopUpActionTypes.HIDE_LOG_OUT_CONFIRMATION_POP_UP,
			});
		}
	};

	// useEffect(() => {
	// 	if (
	// 		(calendarState.show ||
	// 			taskSelectorState.show ||
	// 			mobileSidebarState.show ||
	// 			alertPopUpState.message ||
	// 			errorPopUpState.message ||
	// 			emailConfirmationPopUpState.show ||
	// 			forgotPasswordPopUpState.show) &&
	// 		!overlayState.show
	// 	) {
	// 		dispatch({ type: OverlayActionTypes.SHOW_OVERLAY });
	// 		console.log('here');
	// 	} else {
	// 		console.log(
	// 			calendarState.show,
	// 			taskSelectorState.show,
	// 			mobileSidebarState.show,
	// 			alertPopUpState.message,
	// 			errorPopUpState.message,
	// 			emailConfirmationPopUpState.show,
	// 			forgotPasswordPopUpState.show,
	// 			overlayState.show
	// 		);
	// 	}
	// }, [
	// 	overlayState,
	// 	calendarState,
	// 	taskSelectorState,
	// 	mobileSidebarState,
	// 	alertPopUpState,
	// 	errorPopUpState,
	// 	emailConfirmationPopUpState,
	// 	forgotPasswordPopUpState,
	// ]);

	return ReactDOM.createPortal(
		<div className={classes.overlay} onClick={hideOverlay}></div>,
		document.getElementById('overlay')!
	);
};

export default Overlay;
