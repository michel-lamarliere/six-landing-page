import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { RootState } from '../../../../store/_store';
import { CalendarActionTypes } from '../../../../store/calendar';
import { OverlayActionTypes } from '../../../../store/overlay';

import topArrowIcon from '../../../../assets/icons/top-arrow.svg';
import calendarIcon from '../../../../assets/icons/calendar/calendar_icon.svg';

import classes from '../CalendarAndTaskSelectorButtons.module.scss';

export const CalendarButton: React.FC = () => {
	const dispatch = useDispatch();

	const calendarState = useSelector((state: RootState) => state.calendar);

	const calendarButtonHandler = () => {
		dispatch({ type: CalendarActionTypes.SHOW_CALENDAR });
		dispatch({ type: OverlayActionTypes.SHOW_OVERLAY });
	};

	return (
		<button className={classes.button} onClick={calendarButtonHandler}>
			<img
				src={calendarIcon}
				alt='LogoCalendrier'
				className={classes.button__icon}
			/>
			<img
				src={topArrowIcon}
				className={`${classes.button__arrow} ${
					calendarState.show && classes['button__arrow--open']
				}`}
				alt='Flêche Calendrier'
			/>
		</button>
	);
};

export default CalendarButton;
