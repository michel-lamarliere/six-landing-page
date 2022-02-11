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
}> = (props) => {
	const [showCalendar, setShowCalendar] = useState(false);

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
						Calendrier
					</button>
				)}
				{props.taskSelector && (
					<select
						className={classes.buttons__selector}
						onChange={props.selectHandler}
						name='six'
						defaultValue='food'
					>
						<option value='food'>Alimentation</option>
						<option value='sleep'>Sommeil</option>
						<option value='sport'>Activité Physique</option>
						<option value='relaxation'>Détente</option>
						<option value='work'>Projets</option>
						<option value='social'>Vie Sociale</option>
					</select>
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
								className={classes.calendar__header__button}
								onClick={props.calendarPreviousYearHandler}
							>
								<img src={DoubleLeftArrow} />
							</button>
						)}
						{props.calendar !== 'MONTHLY' ? (
							!props.calendarPreviousMonthHandlerDisabled && (
								<button
									className={classes.calendar__header__button}
									onClick={props.calendarPreviousMonthHandler}
								>
									<img src={LeftArrow} />
								</button>
							)
						) : (
							<div></div>
						)}
						<div>{props.calendarText}</div>
						{props.calendar !== 'MONTHLY' &&
							!props.calendarNextMonthHandlerDisabled && (
								<button
									className={classes.calendar__header__button}
									onClick={props.calendarNextMonthHandler}
								>
									<img src={RightArrow} />
								</button>
							)}
						{!props.calendarNextYearHandlerDisabled && (
							<button
								className={classes.calendar__header__button}
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
