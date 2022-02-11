import React, { useEffect, useState } from 'react';

import { addDays, addHours, addMonths, addYears, getYear, isBefore } from 'date-fns';

import classes from './Calendars.module.scss';
import { useDates } from '../../../shared/hooks/dates-hook';
import DaysOfWeek from './DaysOfWeek';

const MonthlyCalendar: React.FC<{
	date: Date;
	setDate: any;
	text: string;
	showCalendar: boolean;
	setShowCalendar: any;
	calendarButtonHandler: any;
}> = (props) => {
	const [monthStr, setMonthStr] = useState('');
	const [date, setDate] = useState(props.date);
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

	const calendarNextYearHandler = () => {
		setDate(addYears(date, 1));
	};

	const monthOnClickHandler = (event: React.MouseEvent<HTMLButtonElement>) => {
		props.setDate(new Date((event.target as HTMLButtonElement).id));
		props.setShowCalendar(false);
	};

	useEffect(() => {
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
						disabled={isBefore(
							addMonths(props.date, -1),
							new Date(2020, 0, 1)
						)}
					>
						{'<'}
					</button>
					<p>{props.text}</p>
					<button
						onClick={nextHandler}
						disabled={!isBefore(addMonths(props.date, 1), new Date())}
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
						<p>{`${getYear(date)}`}</p>
						<button
							onClick={calendarNextYearHandler}
							disabled={
								!isBefore(addYears(date, 1), addYears(new Date(), 1))
							}
						>
							{'>>'}
						</button>
					</div>
					<div className={classes.calendar_months}>
						{months.map((month, index) => (
							<button
								className={classes.month}
								disabled={
									!isBefore(
										addHours(
											new Date(date.getFullYear(), index, 1),
											1
										),
										new Date()
									)
								}
								onClick={monthOnClickHandler}
								id={`${addHours(
									new Date(date.getFullYear(), index, 1),
									1
								)}`}
							>
								{month}
							</button>
						))}
					</div>
				</div>
			)}
		</div>
	);
};

export default MonthlyCalendar;
