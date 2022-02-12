import { addDays, addHours, addMonths, addYears, getYear, isBefore } from 'date-fns';
import React, { useState } from 'react';
import Calendar from './Calendar';
import calendarClasses from './Calendar.module.scss';

const MonthlyCalendar: React.FC<{
	chosenDate: Date;
	setChosenDate: any;
	setCurrentTask: any;
	headerText: string;
	currentTask: string;
}> = (props) => {
	const [calendarDate, setCalendarDate] = useState(new Date());
	const months = [
		'Janvier',
		'Février',
		'Mars',
		'Avril',
		'Mai',
		'Juin',
		'Juillet',
		'Août',
		'Septembre',
		'Octobre',
		'Novembre',
		'Décembre',
	];

	const selectHandler = (event: React.ChangeEvent<HTMLSelectElement>) => {
		props.setCurrentTask(event.target.value);
	};

	const previousHandler = () => {
		props.setChosenDate(addMonths(props.chosenDate, -1));
	};

	const nextHandler = () => {
		props.setChosenDate(addMonths(props.chosenDate, 1));
	};

	const calendarPreviousYearHandler = () => {
		setCalendarDate(addYears(calendarDate, -1));
	};

	const calendarNextYearHandler = () => {
		setCalendarDate(addYears(calendarDate, 1));
	};

	const monthOnClickHandler = (event: React.MouseEvent<HTMLButtonElement>) => {
		props.setChosenDate(new Date((event.target as HTMLButtonElement).id));
		// props.setShowCalendar(false);
	};

	return (
		<Calendar
			calendar={'MONTHLY'}
			taskSelector={true}
			selectHandler={selectHandler}
			previousHandler={previousHandler}
			previousHandlerDisabled={isBefore(
				addMonths(props.chosenDate, -1),
				new Date(2020, 0, 1)
			)}
			headerText={props.headerText}
			nextHandler={nextHandler}
			nextHandlerDisabled={!isBefore(addMonths(props.chosenDate, 1), new Date())}
			calendarPreviousYearHandler={calendarPreviousYearHandler}
			calendarPreviousYearHandlerDisabled={isBefore(
				addYears(calendarDate, -1),
				new Date(2020, 0, 1)
			)}
			calendarPreviousMonthHandler={null}
			calendarPreviousMonthHandlerDisabled={true}
			calendarText={`${getYear(calendarDate)}`}
			calendarNextMonthHandler={null}
			calendarNextMonthHandlerDisabled={true}
			calendarNextYearHandler={calendarNextYearHandler}
			calendarNextYearHandlerDisabled={
				!isBefore(addYears(calendarDate, 1), new Date())
			}
			currentTask={props.currentTask}
		>
			<div className={calendarClasses.month}>
				{months.map((month, index) => (
					<button
						className={`${calendarClasses.month__month} ${
							!isBefore(
								addHours(
									new Date(calendarDate.getFullYear(), index, 1),
									1
								),
								new Date()
							) && calendarClasses.month__month__disabled
						}`}
						disabled={
							!isBefore(
								addHours(
									new Date(calendarDate.getFullYear(), index, 1),
									1
								),
								new Date()
							)
						}
						onClick={monthOnClickHandler}
						id={`${addHours(
							new Date(calendarDate.getFullYear(), index, 1),
							1
						)}`}
					>
						{month}
					</button>
				))}
			</div>
		</Calendar>
	);
};

export default MonthlyCalendar;
