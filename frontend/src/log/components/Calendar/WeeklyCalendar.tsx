import React, { useEffect, useState } from 'react';

import {
	addDays,
	addHours,
	addMonths,
	addYears,
	format,
	getDay,
	getDaysInMonth,
	getMonth,
	getWeeksInMonth,
	getYear,
	isSameWeek,
	startOfMonth,
} from 'date-fns';
import { isBefore } from 'date-fns/esm';

import classes from './Calendars.module.scss';
import { useDates } from '../../../shared/hooks/dates-hook';
import user from '../../../shared/store/user';
import DaysOfWeek from './DaysOfWeek';

const DatePicker: React.FC<{
	date: Date;
	setDate: any;
	text: string;
	showCalendar: boolean;
	setShowCalendar: any;
	calendarButtonHandler: any;
}> = (props) => {
	const [date, setDate] = useState(props.date);
	const [weeks, setWeeks] = useState<any[]>([]);
	const [monthStr, setMonthStr] = useState('');

	const { getMonthFn } = useDates();

	const previousHandler = () => {
		props.setDate(addDays(props.date, -7));
	};

	const nextHandler = () => {
		props.setDate(addDays(props.date, 7));
	};

	const calendarPreviousYearHandler = () => {
		setDate(addYears(date, -1));
	};

	const calendarPreviousMonthHandler = () => {
		setDate(addMonths(date, -1));
	};

	const calendarNextMonthHandler = () => {
		setDate(addMonths(date, 1));
	};

	const calendarNextYearHandler = () => {
		setDate(addYears(date, 1));
	};

	const weekOnClickHandler = (event: React.MouseEvent<HTMLElement>) => {
		event.preventDefault();
		const year = (event.target as HTMLElement).id.slice(0, 4);
		const month = (event.target as HTMLElement).id.slice(5, 7);
		const day = (event.target as HTMLElement).id.slice(8, 10);
		console.log((event.target as HTMLElement).id);
		// console.log(year, month, day);
		props.setDate(new Date(+year, +month - 1, +day));
		props.setShowCalendar(false);
	};

	const createWeekCalendar = () => {
		const weeksInMonth = getWeeksInMonth(date, { weekStartsOn: 1 });
		const firstDateOfMonth = startOfMonth(date);
		const dayOfFirstDateOfMonth = getDay(firstDateOfMonth);

		let firstDateOfFirstWeekOfMonth = addDays(
			firstDateOfMonth,
			-dayOfFirstDateOfMonth + 1
		);

		const weeks = [];
		for (let i = 0; i < weeksInMonth; i++) {
			const week = [];

			for (let y = 0; y < 7; y++) {
				week.push(addDays(firstDateOfFirstWeekOfMonth, y));
			}

			weeks.push(week);
			firstDateOfFirstWeekOfMonth = addDays(firstDateOfFirstWeekOfMonth, 7);
		}

		console.log(weeks);
		setWeeks(weeks);
	};

	useEffect(() => {
		setDate(props.date);
		// createWeekCalendar();
	}, [props.date]);

	useEffect(() => {
		getMonthFn(date.getMonth(), true, setMonthStr);
		createWeekCalendar();
	}, [date]);

	return (
		<div className={classes.wrapper}>
			{!props.showCalendar && (
				<div className={classes.header}>
					<button
						onClick={previousHandler}
						disabled={isBefore(addDays(props.date, -7), new Date(2020, 0, 1))}
					>
						{'<'}
					</button>
					<p>{props.text}</p>
					<button
						onClick={nextHandler}
						disabled={!isBefore(addDays(props.date, 7), new Date())}
					>
						{'>'}
					</button>
				</div>
			)}
			{props.showCalendar && (
				<div className={classes.calendar}>
					<div className={classes.fullheader}>
						<button
							onClick={calendarPreviousYearHandler}
							disabled={isBefore(addYears(date, -1), new Date(2020, 0, 1))}
						>
							{'<<'}
						</button>
						<button
							onClick={calendarPreviousMonthHandler}
							disabled={isBefore(addMonths(date, -1), new Date(2020, 0, 1))}
						>
							{'<'}
						</button>
						<p>{`${monthStr} ${getYear(date)}`}</p>
						<button
							onClick={calendarNextMonthHandler}
							disabled={!isBefore(addMonths(date, 1), new Date())}
						>
							{'>'}
						</button>
						<button
							onClick={calendarNextYearHandler}
							disabled={!isBefore(addYears(date, 1), new Date())}
						>
							{'>>'}
						</button>
					</div>
					<div className={classes.calendar_weeks}>
						<DaysOfWeek />
						{weeks.length > 0 &&
							weeks.map((week) => (
								<button
									className={classes.week}
									onClick={weekOnClickHandler}
									disabled={!isBefore(new Date(week[0]), new Date())}
									id={`${format(new Date(week[6]), 'yyyy-MM-dd')}`}
								>
									{console.log(week[0])}
									{console.log(
										`${format(new Date(week[6]), 'yyyy-MM-dd')}`
									)}
									{week.map((day: any) => (
										<button
											className={classes.week_day}
											onClick={weekOnClickHandler}
											disabled={
												!isBefore(new Date(week[0]), new Date())
											}
											id={`${format(
												new Date(week[6]),
												'yyyy-MM-dd'
											)}`}
										>
											{format(day, 'dd')}
										</button>
									))}
								</button>
							))}
					</div>
				</div>
			)}
		</div>
	);
};

export default DatePicker;
