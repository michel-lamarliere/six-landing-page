import React, { useState } from 'react';
import classes from './Calendar.module.scss';
import DaysOfWeek from './DaysOfWeek';

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
		<div>
			<div className={classes.selectors}>
				{props.calendar !== 'ANNUAL_CHART' && (
					<button onClick={calendarButtonHandler}>Calendrier</button>
				)}
				{props.taskSelector && (
					<select name='six' onChange={props.selectHandler} defaultValue='food'>
						<option value='food'>Alimentation</option>
						<option value='sleep'>Sommeil</option>
						<option value='sport'>Activité Physique</option>
						<option value='relaxation'>Détente</option>
						<option value='work'>Projets</option>
						<option value='social'>Vie Sociale</option>
					</select>
				)}
			</div>
			{!showCalendar && (
				<div className={classes.header}>
					<button
						onClick={props.previousHandler}
						disabled={props.previousHandlerDisabled}
					>
						{'<'}
					</button>
					<p>{props.headerText}</p>
					<button
						onClick={props.nextHandler}
						disabled={props.nextHandlerDisabled}
					>
						{'>'}
					</button>
				</div>
			)}
			{showCalendar && (
				<div>
					<div className={classes.fullheader}>
						<button
							onClick={props.calendarPreviousYearHandler}
							disabled={props.calendarPreviousYearHandlerDisabled}
						>
							{'<<'}
						</button>
						{props.calendar !== 'MONTHLY' && (
							<button
								onClick={props.calendarPreviousMonthHandler}
								disabled={props.calendarPreviousMonthHandlerDisabled}
							>
								{'<'}
							</button>
						)}
						<p>{props.calendarText}</p>
						{props.calendar !== 'MONTHLY' && (
							<button
								onClick={props.calendarNextMonthHandler}
								disabled={props.calendarNextMonthHandlerDisabled}
							>
								{'>'}
							</button>
						)}
						<button
							onClick={props.calendarNextYearHandler}
							disabled={props.calendarNextYearHandlerDisabled}
						>
							{'>>'}
						</button>
					</div>
					<div>
						<DaysOfWeek />
						<div className={classes.calendar_days}>{props.children}</div>
					</div>
				</div>
			)}
		</div>
	);
};

export default Calendar;
