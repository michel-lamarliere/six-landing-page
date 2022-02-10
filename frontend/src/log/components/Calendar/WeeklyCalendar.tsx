import React, { useEffect, useState } from 'react';

import {
	addDays,
	addMonths,
	addYears,
	getDay,
	getDaysInMonth,
	getMonth,
	getYear,
} from 'date-fns';
import { isBefore } from 'date-fns/esm';

import classes from './DatePicker.module.scss';
import { useDates } from '../../../shared/hooks/dates-hook';

const DatePicker: React.FC<{
	date: Date;
	setDate: any;
	text: string;
	showCalendar: boolean;
	setShowCalendar: any;
	calendarButtonHandler: any;
}> = (props) => {
	const [date, setDate] = useState(props.date);
	const [days, setDays] = useState<any[]>([]);
	const [monthStr, setMonthStr] = useState('');
	const [emptyDays, setEmptyDays] = useState<any[]>([]);

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

	const weekOnClickHandler = (event: React.MouseEvent<HTMLButtonElement>) => {
		event.preventDefault();
		const year = (event.target as HTMLButtonElement).id.slice(0, 4);
		const month = (event.target as HTMLButtonElement).id.slice(5, 7);
		const day = (event.target as HTMLButtonElement).id.slice(8, 10);
		props.setDate(new Date(+year, +month, +day));
		props.setShowCalendar(false);
	};

	const createDayCalendar = () => {
		const daysInMonth = getDaysInMonth(props.date);
		const days = [];

		for (let i = 1; i < daysInMonth + 1; i++) {
			days.push(i);
		}
		setDays(days);

		let firstDayOfWeek: number = getDay(props.date);
		const emptyDays = [];

		console.log(firstDayOfWeek);
		if (firstDayOfWeek === 0) {
			firstDayOfWeek = 7;
		}

		for (let i = 1; i < firstDayOfWeek; i++) {
			emptyDays.push(0);
		}

		setEmptyDays(emptyDays);
	};

	useEffect(() => {
		createDayCalendar();
		setDate(props.date);
	}, [props.date]);

	useEffect(() => {
		getMonthFn(date.getMonth(), true, setMonthStr);
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
						{emptyDays.map((emptyDay) => (
							<div></div>
						))}
						{days.map((day) => (
							<button
								className={classes.day}
								disabled={
									!isBefore(
										new Date(
											date.getFullYear(),
											getMonth(date) < 10
												? 0 + getMonth(date)
												: getMonth(date),
											day < 10 ? '0' + day : day
										),
										new Date()
									)
								}
								id={`${date.getFullYear()}-${
									getMonth(date) < 10
										? '0' + getMonth(date)
										: getMonth(date)
								}-${day < 10 ? '0' + day : day}`}
								onClick={weekOnClickHandler}
							>
								{day}
							</button>
						))}
					</div>
				</div>
			)}
		</div>
	);
};

export default DatePicker;
