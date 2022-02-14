import React, { useState } from 'react';

import DaysOfWeek from './DaysOfWeek';

import LeftArrow from '../../assets/icons/left-arrow.svg';
import DoubleLeftArrow from '../../assets/icons/double-left-arrow.svg';
import RightArrow from '../../assets/icons/right-arrow.svg';
import DoubleRightArrow from '../../assets/icons/double-right-arrow.svg';
import TopArrow from '../../assets/icons/top-arrow.svg';

import classes from './Calendar.module.scss';

const Calendar: React.FC<{
	calendar: 'ANNUAL_CHART' | 'DAILY' | 'WEEKLY' | 'MONTHLY';
	taskSelector: boolean;
	selectHandler: any;
	previousHandler: any;
	previousHandlerDisabled: boolean;
	headerText: string;
	nextHandler: any;
	nextHandlerDisabled: boolean;
	calendarPreviousYearHandler: any;
	calendarPreviousYearHandlerDisabled: boolean;
	calendarPreviousMonthHandler: any;
	calendarPreviousMonthHandlerDisabled: boolean;
	calendarText: string;
	calendarNextMonthHandler: any;
	calendarNextMonthHandlerDisabled: boolean;
	calendarNextYearHandler: any;
	calendarNextYearHandlerDisabled: boolean;
	currentTask?: any;
}> = (props) => {
	const [showCalendar, setShowCalendar] = useState(false);
	const [showTaskSelector, setShowTaskSelector] = useState(false);

	const calendarButtonHandler = () => {
		setShowCalendar((prev) => !prev);
	};

	return (
		<div className={classes.wrapper}>
			<div className={classes.buttons}>
				{props.calendar !== 'ANNUAL_CHART' && (
					<button
						className={classes.buttons__calendar}
						onClick={calendarButtonHandler}
					>
						{/* <img /> */}
						<img
							src={TopArrow}
							className={`${classes.buttons__button__arrow} ${
								showCalendar && classes['buttons__calendar__arrow--open']
							}`}
							alt='CalendarButton'
						/>
					</button>
				)}
				{props.taskSelector && (
					<>
						<button
							onClick={() => setShowTaskSelector((prev) => !prev)}
							className={classes.buttons__selector}
						>
							{props.currentTask}
							<img
								src={TopArrow}
								className={`${classes.buttons__button__arrow} ${
									showTaskSelector &&
									classes['buttons__calendar__arrow--open']
								}`}
								alt='CalendarButton'
							/>
						</button>
						{showTaskSelector && (
							<div className={classes.selector}>
								<button value='food' onClick={props.selectHandler}>
									Alimentation
								</button>
								<button value='sleep' onClick={props.selectHandler}>
									Sommeil
								</button>
								<button value='sport' onClick={props.selectHandler}>
									Sport
								</button>
								<button value='relaxation' onClick={props.selectHandler}>
									Détente
								</button>
								<button value='work' onClick={props.selectHandler}>
									Projets
								</button>
								<button value='social' onClick={props.selectHandler}>
									Vie Sociale
								</button>
							</div>
						)}
					</>
				)}
			</div>
			<div className={classes.header}>
				<button
					className={classes.header__button}
					onClick={props.previousHandler}
					disabled={props.previousHandlerDisabled}
				>
					<img src={LeftArrow} />
				</button>
				<p>{props.headerText}</p>
				<button
					className={classes.header__button}
					onClick={props.nextHandler}
					disabled={props.nextHandlerDisabled}
				>
					<img src={RightArrow} />
				</button>
			</div>
			{showCalendar && (
				<div className={classes.calendar}>
					<div className={classes.calendar__header}>
						{!props.calendarPreviousYearHandlerDisabled && (
							<button
								className={`${classes.calendar__header__button} ${classes['calendar__header__button--doubleleft']}`}
								onClick={props.calendarPreviousYearHandler}
							>
								<img src={DoubleLeftArrow} />
							</button>
						)}
						{props.calendar !== 'MONTHLY' &&
							!props.calendarPreviousMonthHandlerDisabled && (
								<button
									className={`${classes.calendar__header__button} ${classes['calendar__header__button--left']}`}
									onClick={props.calendarPreviousMonthHandler}
								>
									<img src={LeftArrow} />
								</button>
							)}
						<div className={classes.calendar__header__text}>
							{props.calendarText}
						</div>
						{props.calendar !== 'MONTHLY' &&
							!props.calendarNextMonthHandlerDisabled && (
								<button
									className={`${classes.calendar__header__button} ${classes['calendar__header__button--right']}`}
									onClick={props.calendarNextMonthHandler}
								>
									<img src={RightArrow} />
								</button>
							)}
						{!props.calendarNextYearHandlerDisabled && (
							<button
								className={`${classes.calendar__header__button} ${classes['calendar__header__button--doubleright']}`}
								onClick={props.calendarNextYearHandler}
							>
								<img src={DoubleRightArrow} />
							</button>
						)}
					</div>
					<div className={classes.calendar__calendar}>
						{(props.calendar === 'DAILY' || props.calendar === 'WEEKLY') && (
							<DaysOfWeek />
						)}
						{props.children}
					</div>
				</div>
			)}
		</div>
	);
};

export default Calendar;
