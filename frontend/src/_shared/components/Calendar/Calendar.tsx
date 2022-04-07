import React from 'react';
import { useSelector } from 'react-redux';

import { RootState } from '../../store/_store';

import CalendarDaysOfWeek from './CalendarDaysOfWeek';
import { CalendarButton, TaskSelectorButton } from './CalendarButtons';

import leftArrowIcon from '../../assets/imgs/icons/calendar/left-arrow.svg';
import doubleLeftArrowIcon from '../../assets/imgs/icons/calendar/double-left-arrow.svg';
import rightArrowIcon from '../../assets/imgs/icons/calendar/right-arrow.svg';
import doubleRightArrowIcon from '../../assets/imgs/icons/calendar/double-right-arrow.svg';

import classes from './Calendar.module.scss';

export enum calendarTypes {
	DAILY = 'DAILY',
	WEEKLY = 'WEEKLY',
	MONTHLY = 'MONTHLY',
	ANNUAL_CHART = 'ANNUAL_CHART',
}

type CommonProps = {
	previousHandler: () => void;
	previousHandlerDisabled: boolean;
	headerText: string;
	nextHandler: () => void;
	nextHandlerDisabled: boolean;
};

type TestProps =
	| {
			calendar: calendarTypes.DAILY | calendarTypes.WEEKLY;
			selectHandler?: never;
			currentTask?: never;
			calendarPreviousYearHandler: () => void;
			calendarPreviousYearHandlerDisabled: boolean;
			calendarPreviousMonthHandler: () => void;
			calendarPreviousMonthHandlerDisabled: boolean;
			calendarText: string;
			calendarNextMonthHandler: () => void;
			calendarNextMonthHandlerDisabled: boolean;
			calendarNextYearHandler: () => void;
			calendarNextYearHandlerDisabled: boolean;
	  }
	| {
			calendar: calendarTypes.MONTHLY;
			chosenTask: string;
			selectHandler: (event: React.MouseEvent<HTMLButtonElement>) => void;
			calendarPreviousYearHandler: () => void;
			calendarPreviousYearHandlerDisabled: boolean;
			calendarPreviousMonthHandler?: never;
			calendarPreviousMonthHandlerDisabled?: never;
			calendarText: string;
			calendarNextMonthHandler?: never;
			calendarNextMonthHandlerDisabled?: never;
			calendarNextYearHandler: () => void;
			calendarNextYearHandlerDisabled: boolean;
	  }
	| {
			calendar: calendarTypes.ANNUAL_CHART;
			chosenTask: string;
			selectHandler: (event: React.MouseEvent<HTMLButtonElement>) => void;
			calendarPreviousYearHandler?: never;
			calendarPreviousYearHandlerDisabled?: never;
			calendarPreviousMonthHandler?: never;
			calendarPreviousMonthHandlerDisabled?: never;
			calendarText?: never;
			calendarNextMonthHandler?: never;
			calendarNextMonthHandlerDisabled?: never;
			calendarNextYearHandler?: never;
			calendarNextYearHandlerDisabled?: never;
			calendarButtonHandler?: never;
	  };

type Props = CommonProps & TestProps;

const Calendar: React.FC<Props> = (props) => {
	const calendarState = useSelector((state: RootState) => state.calendar);

	return (
		<div className={classes.wrapper}>
			<div className={classes.buttons}>
				{props.calendar !== calendarTypes.ANNUAL_CHART && <CalendarButton />}
				{(props.calendar === calendarTypes.MONTHLY ||
					props.calendar === calendarTypes.ANNUAL_CHART) && (
					<TaskSelectorButton
						chosenTask={props.chosenTask}
						selectHandler={props.selectHandler}
					/>
				)}
			</div>
			<div className={classes.header}>
				{!props.previousHandlerDisabled && (
					<button
						className={`${classes.header__button} ${classes['header__button--left']}`}
						onClick={props.previousHandler}
						disabled={props.previousHandlerDisabled}
					>
						<img src={leftArrowIcon} alt='Flêche gauche' />
					</button>
				)}
				<h1 className={classes.header__text}>{props.headerText}</h1>
				{!props.nextHandlerDisabled && (
					<button
						className={`${classes.header__button} ${classes['header__button--right']}`}
						onClick={props.nextHandler}
						disabled={props.nextHandlerDisabled}
					>
						<img src={rightArrowIcon} alt='Flêche droite' />
					</button>
				)}
			</div>
			{calendarState.show && (
				<div className={classes.calendar}>
					<div className={classes.calendar__header}>
						{!props.calendarPreviousYearHandlerDisabled && (
							<button
								className={`${classes.calendar__header__button} ${classes['calendar__header__button--double-left']}`}
								onClick={props.calendarPreviousYearHandler}
							>
								<img
									src={doubleLeftArrowIcon}
									alt='Flêche Année Précédente'
								/>
							</button>
						)}
						{(props.calendar === calendarTypes.DAILY ||
							props.calendar === calendarTypes.WEEKLY) &&
							!props.calendarPreviousMonthHandlerDisabled && (
								<button
									className={`${classes.calendar__header__button} ${classes['calendar__header__button--left']}`}
									onClick={props.calendarPreviousMonthHandler}
								>
									<img
										src={leftArrowIcon}
										alt='Flêche Mois Précédente'
									/>
								</button>
							)}
						<div className={classes.calendar__header__text}>
							{props.calendarText}
						</div>
						{(props.calendar === calendarTypes.DAILY ||
							props.calendar === calendarTypes.WEEKLY) &&
							!props.calendarNextMonthHandlerDisabled && (
								<button
									className={`${classes.calendar__header__button} ${classes['calendar__header__button--right']}`}
									onClick={props.calendarNextMonthHandler}
								>
									<img src={rightArrowIcon} alt='Flêche Mois Suivant' />
								</button>
							)}
						{!props.calendarNextYearHandlerDisabled && (
							<button
								className={`${classes.calendar__header__button} ${classes['calendar__header__button--double-right']}`}
								onClick={props.calendarNextYearHandler}
							>
								<img
									src={doubleRightArrowIcon}
									alt='Flêche Année Suivante'
								/>
							</button>
						)}
					</div>
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
