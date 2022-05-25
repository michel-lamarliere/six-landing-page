import React, { Dispatch, SetStateAction } from 'react';
import { useSelector } from 'react-redux';

import { addDays, addMonths, isBefore } from 'date-fns';

import { RootState } from '../../../store/_store';

import CalendarDaysOfWeek from '../CalendarDaysOfWeek/CalendarDaysOfWeek';
import CalendarButton from '../../buttons/CalendarAndTaskSelectorButtons/CalendarButton/CalendarButton';
import TaskSelectorButton from '../../buttons/CalendarAndTaskSelectorButtons/TaskSelectorButton/TaskSelectorButton';
import CalendarHeader from '../CalendarHeader/CalendarHeader';
import DateNavigation, { DateNavigationTypes } from '../../DateNavigation/DateNavigation';

import classes from './Calendar.module.scss';

export enum calendarTypes {
	DAILY = 'DAILY',
	WEEKLY = 'WEEKLY',
	MONTHLY = 'MONTHLY',
}

type CommonProps = {
	headerText: string;
	chosenDate: Date;
	setChosenDate: (arg0: Date) => void;
	calendarText: string;
	calendarDate: Date;
	setCalendarDate: Dispatch<SetStateAction<Date>>;
};

type SpecialProps =
	| {
			calendar: calendarTypes.DAILY | calendarTypes.WEEKLY;
			selectHandler?: never;
			chosenTask?: never;
	  }
	| {
			calendar: calendarTypes.MONTHLY;
			chosenTask: string;
			selectTaskHandler: (event: React.MouseEvent<HTMLButtonElement>) => void;
	  };

type Props = CommonProps & SpecialProps;

const Calendar: React.FC<Props> = (props) => {
	const calendarState = useSelector((state: RootState) => state.calendar);

	let previousHandler;
	let nextHandler;

	let previousHandlerDisabled;
	let nextHandlerDisabled;

	if (props.calendar === calendarTypes.DAILY) {
		previousHandler = () => {
			props.setChosenDate(addDays(props.chosenDate, -1));
		};

		nextHandler = () => {
			props.setChosenDate(addDays(props.chosenDate, 1));
		};

		previousHandlerDisabled = () => {
			return isBefore(addDays(props.chosenDate, -1), new Date(2020, 0, 1));
		};

		nextHandlerDisabled = () => {
			return !isBefore(addDays(props.chosenDate, 1), new Date());
		};
	} else if (props.calendar === calendarTypes.WEEKLY) {
		previousHandler = () => {
			props.setChosenDate(addDays(props.chosenDate, -7));
		};

		nextHandler = () => {
			props.setChosenDate(addDays(props.chosenDate, 7));
		};

		previousHandlerDisabled = () => {
			return isBefore(addDays(props.chosenDate, -7), new Date(2020, 0, 1));
		};

		nextHandlerDisabled = () => {
			return !isBefore(addDays(props.chosenDate, 7), new Date());
		};
	} else {
		previousHandler = () => {
			props.setChosenDate(addMonths(props.chosenDate, -1));
		};

		nextHandler = () => {
			props.setChosenDate(addMonths(props.chosenDate, 1));
		};

		previousHandlerDisabled = () => {
			return isBefore(addMonths(props.chosenDate, -1), new Date(2020, 0, 1));
		};

		nextHandlerDisabled = () => {
			return !isBefore(addMonths(props.chosenDate, 1), new Date());
		};
	}

	return (
		<div className={classes.wrapper}>
			<div className={classes.buttons}>
				<CalendarButton />
				{props.calendar === calendarTypes.MONTHLY && (
					<TaskSelectorButton
						chosenTask={props.chosenTask}
						selectTaskHandler={props.selectTaskHandler}
					/>
				)}
			</div>
			<DateNavigation
				type={DateNavigationTypes.VIEW}
				headerText={props.headerText}
				previousHandler={previousHandler}
				nextHandler={nextHandler}
				previousHandlerDisabled={previousHandlerDisabled}
				nextHandlerDisabled={nextHandlerDisabled}
			/>
			{calendarState.show && (
				<div className={classes.calendar}>
					<CalendarHeader
						calendar={props.calendar}
						calendarText={props.calendarText}
						chosenDate={props.chosenDate}
						setChosenDate={props.setChosenDate}
						calendarDate={props.calendarDate}
						setCalendarDate={props.setCalendarDate}
					/>
					<div className={classes.calendar__calendar}>
						{(props.calendar === calendarTypes.DAILY ||
							props.calendar === calendarTypes.WEEKLY) && (
							<CalendarDaysOfWeek />
						)}
						{props.children}
					</div>
				</div>
			)}
		</div>
	);
};

export default Calendar;
