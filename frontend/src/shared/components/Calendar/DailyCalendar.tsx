import {
	addDays,
	addHours,
	addMonths,
	addYears,
	getDay,
	getDaysInMonth,
	getMonth,
	getYear,
	isBefore,
	isSameDay,
	startOfMonth,
} from 'date-fns';
import React, { useEffect, useState } from 'react';
import { useDatesFn } from '../../hooks/dates-hook';
import Calendar from './Calendar';
import calendarClasses from './Calendar.module.scss';

const DailyCalendar: React.FC<{
	chosenDate: Date;
	setChosenDate: any;
	headerText: string;
}> = (props) => {
	const { getDayFn, getMonthFn } = useDatesFn();

	const [calendarDate, setCalendarDate] = useState(new Date());
	const [emptyCalendarDays, setEmptyCalendarDays] = useState<any[]>([]);
	const [calendarDays, setCalendarDays] = useState<any[]>([]);
	const [calendarMonthStr, setCalendarMonthStr] = useState('');

	const previousHandler = () => {
		props.setChosenDate(addDays(props.chosenDate, -1));
	};

	const nextHandler = () => {
		props.setChosenDate(addDays(props.chosenDate, 1));
	};

	const calendarPreviousYearHandler = () => {
		setCalendarDate(addYears(calendarDate, -1));
	};

	const calendarPreviousMonthHandler = () => {
		setCalendarDate(addMonths(calendarDate, -1));
	};

	const calendarNextMonthHandler = () => {
		setCalendarDate(addMonths(calendarDate, 1));
	};

	const calendarNextYearHandler = () => {
		setCalendarDate(addYears(calendarDate, 1));
	};

	const createDayCalendar = () => {
		const daysInMonth = getDaysInMonth(calendarDate);
		const days = [];

		for (let i = 1; i < daysInMonth + 1; i++) {
			days.push(i);
		}
		setCalendarDays(days);

		let firstDayOfWeek: number = getDay(startOfMonth(calendarDate));
		console.log(firstDayOfWeek);
		const emptyDays = [];

		console.log(firstDayOfWeek);
		if (firstDayOfWeek === 0) {
			firstDayOfWeek = 7;
		}

		for (let i = 1; i < firstDayOfWeek; i++) {
			emptyDays.push(0);
		}

		setEmptyCalendarDays(emptyDays);
	};

	const dayOnClickHandler = (event: React.MouseEvent<HTMLButtonElement>) => {
		event.preventDefault();
		const year = (event.target as HTMLButtonElement).id.slice(0, 4);
		const month = (event.target as HTMLButtonElement).id.slice(5, 7);
		const day = (event.target as HTMLButtonElement).id.slice(8, 10);
		props.setChosenDate(addHours(new Date(+year, +month, +day), 1));
		// props.setShowCalendar(false);
	};

	useEffect(() => {
		getMonthFn(calendarDate.getMonth(), true, setCalendarMonthStr);
		createDayCalendar();
	}, [calendarDate]);

	return (
		<Calendar
			calendar={'DAILY'}
			taskSelector={false}
			selectHandler={null}
			previousHandler={previousHandler}
			previousHandlerDisabled={isBefore(
				addDays(props.chosenDate, -1),
				new Date(2020, 0, 1)
			)}
			headerText={props.headerText}
			nextHandler={nextHandler}
			nextHandlerDisabled={!isBefore(addDays(props.chosenDate, 1), new Date())}
			calendarPreviousYearHandler={calendarPreviousYearHandler}
			calendarPreviousYearHandlerDisabled={isBefore(
				addYears(calendarDate, -1),
				new Date(2020, 0, 1)
			)}
			calendarPreviousMonthHandler={calendarPreviousMonthHandler}
			calendarPreviousMonthHandlerDisabled={isBefore(
				addMonths(calendarDate, -1),
				new Date(2020, 0, 1)
			)}
			calendarText={`${calendarMonthStr} ${getYear(calendarDate)}`}
			calendarNextMonthHandler={calendarNextMonthHandler}
			calendarNextMonthHandlerDisabled={
				!isBefore(addMonths(calendarDate, 1), new Date())
			}
			calendarNextYearHandler={calendarNextYearHandler}
			calendarNextYearHandlerDisabled={
				!isBefore(addYears(calendarDate, 1), new Date())
			}
		>
			<div className={calendarClasses.calendar__calendar__days}>
				{emptyCalendarDays.map(() => (
					<div></div>
				))}
				{calendarDays.map((day) => (
					<button
						className={`${calendarClasses.day} ${
							isSameDay(
								new Date(
									calendarDate.getFullYear(),
									getMonth(calendarDate),
									day < 10 ? '0' + day : day
								),
								new Date()
							) && calendarClasses['day--today']
						} ${
							isSameDay(
								props.chosenDate,
								new Date(
									calendarDate.getFullYear(),
									getMonth(calendarDate),
									day < 10 ? '0' + day : day
								)
							) && calendarClasses['day--chosen-date']
						} ${
							!isBefore(
								new Date(
									calendarDate.getFullYear(),
									getMonth(calendarDate) < 10
										? 0 + getMonth(calendarDate)
										: getMonth(calendarDate),
									day < 10 ? '0' + day : day
								),
								new Date()
							) && calendarClasses['day--disabled']
						}`}
						disabled={
							!isBefore(
								new Date(
									calendarDate.getFullYear(),
									getMonth(calendarDate) < 10
										? 0 + getMonth(calendarDate)
										: getMonth(calendarDate),
									day < 10 ? '0' + day : day
								),
								new Date()
							)
						}
						id={`${calendarDate.getFullYear()}-${
							getMonth(calendarDate) < 10
								? '0' + getMonth(calendarDate)
								: getMonth(calendarDate)
						}-${day < 10 ? '0' + day : day}`}
						onClick={dayOnClickHandler}
					>
						{day}
					</button>
				))}
			</div>
		</Calendar>
	);
};

export default DailyCalendar;
