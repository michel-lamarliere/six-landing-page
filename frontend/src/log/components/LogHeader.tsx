import React, { useState } from 'react';
import CalendarButton from './Calendar/CalendarButton';
import DailyCalendar from './Calendar/DailyCalendar';
import MonthlyCalendar from './Calendar/MonthlyCalendar';
import WeeklyCalendar from './Calendar/WeeklyCalendar';
import AnnualChartCalendar from './Calendar/AnnualChartCalendar';

import classes from './LogHeader.module.scss';

const LogHeader: React.FC<{
	setDate: any;
	date: Date;
	text: string;
	selector_task?: boolean;
	selectHandler?: any;
	calendar: 'DAILY' | 'WEEKLY' | 'MONTHLY' | 'ANNUAL_CHART';
}> = (props) => {
	const [showCalendar, setShowCalendar] = useState(false);

	const calendarButtonHandler = () => {
		setShowCalendar((prev) => !prev);
	};

	return (
		<>
			<div className={classes.selectors}>
				{props.calendar !== 'ANNUAL_CHART' && (
					<CalendarButton onClick={calendarButtonHandler} />
				)}
				{props.selector_task && (
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
			<div className={classes.buttons}>
				{props.calendar === 'DAILY' && (
					<DailyCalendar
						setDate={props.setDate}
						date={props.date}
						text={props.text}
						showCalendar={showCalendar}
						setShowCalendar={setShowCalendar}
						calendarButtonHandler={calendarButtonHandler}
					/>
				)}
				{props.calendar === 'WEEKLY' && (
					<WeeklyCalendar
						setDate={props.setDate}
						date={props.date}
						text={props.text}
						showCalendar={showCalendar}
						setShowCalendar={setShowCalendar}
						calendarButtonHandler={calendarButtonHandler}
					/>
				)}
				{props.calendar === 'MONTHLY' && (
					<MonthlyCalendar
						setDate={props.setDate}
						date={props.date}
						text={props.text}
						showCalendar={showCalendar}
						setShowCalendar={setShowCalendar}
						calendarButtonHandler={calendarButtonHandler}
					/>
				)}
				{props.calendar === 'ANNUAL_CHART' && (
					<AnnualChartCalendar
						setDate={props.setDate}
						date={props.date}
						text={props.text}
					/>
				)}
			</div>
		</>
	);
};

export default LogHeader;
