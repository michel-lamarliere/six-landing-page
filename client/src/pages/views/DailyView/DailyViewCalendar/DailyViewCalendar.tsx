import React, { Dispatch, SetStateAction, useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';

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

import { CalendarActionTypes } from '../../../../store/calendar';
import { OverlayActionTypes } from '../../../../store/overlay';

import { getMonthFnTypes, useDatesFn } from '../../../../hooks/dates-hook';

import Calendar, {
	calendarTypes,
} from '../../../../components/calendar/Calendar/Calendar';

import calendarClasses from '../../../../components/calendar/Calendar/Calendar.module.scss';

const DailyCalendar: React.FC<{
	chosenDate: Date;
	setChosenDate: Dispatch<SetStateAction<Date>>;
	headerText: string;
}> = (props) => {
	const dispatch = useDispatch();
	const { getMonthFn } = useDatesFn();

	const [calendarDate, setCalendarDate] = useState(new Date());
	const [emptyCalendarDays, setEmptyCalendarDays] = useState<number[]>([]);
	const [calendarDays, setCalendarDays] = useState<number[]>([]);
	const [calendarMonthStr, setCalendarMonthStr] = useState('');

	const createDayCalendar = () => {
		const daysInMonth = getDaysInMonth(calendarDate);
		const days = [];

		for (let i = 1; i < daysInMonth + 1; i++) {
			days.push(i);
		}
		setCalendarDays(days);

		let firstDayOfWeek: number = getDay(startOfMonth(calendarDate));
		const emptyDays = [];

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

		dispatch({ type: CalendarActionTypes.HIDE_CALENDAR });
		dispatch({ type: OverlayActionTypes.HIDE_OVERLAY });
	};

	useEffect(() => {
		getMonthFn({
			type: getMonthFnTypes.STATE,
			monthNumber: calendarDate.getMonth(),
			abreviation: true,
			setState: setCalendarMonthStr,
		});
		createDayCalendar();
	}, [calendarDate]);

	return (
		<Calendar
			calendar={calendarTypes.DAILY}
			chosenDate={props.chosenDate}
			setChosenDate={props.setChosenDate}
			calendarDate={calendarDate}
			setCalendarDate={setCalendarDate}
			headerText={props.headerText}
			calendarText={`${calendarMonthStr} ${getYear(calendarDate)}`}
		>
			<div className={calendarClasses.calendar__calendar__days}>
				{emptyCalendarDays.map((data, index) => (
					<div key={`emptyBox-${index}`}></div>
				))}
				{calendarDays.map((day) => (
					<button
						className={`${calendarClasses.day} ${
							isSameDay(
								new Date(
									calendarDate.getFullYear(),
									getMonth(calendarDate),
									day
								),
								new Date()
							) && calendarClasses['day--today']
						} ${
							isSameDay(
								props.chosenDate,
								new Date(
									calendarDate.getFullYear(),
									getMonth(calendarDate),
									day
								)
							) && calendarClasses['day--chosen-date']
						} ${
							!isBefore(
								new Date(
									calendarDate.getFullYear(),
									getMonth(calendarDate) < 10
										? 0 + getMonth(calendarDate)
										: getMonth(calendarDate),
									day
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
									day
								),
								new Date()
							) &&
							!isSameDay(
								new Date(
									calendarDate.getFullYear(),
									getMonth(calendarDate) < 10
										? 0 + getMonth(calendarDate)
										: getMonth(calendarDate),
									day
								),
								new Date()
							)
						}
						id={`${calendarDate.getFullYear()}-${
							getMonth(calendarDate) < 10
								? '0' + getMonth(calendarDate)
								: getMonth(calendarDate)
						}-${day < 10 ? '0' + day : day}`}
						key={`${calendarDate.getFullYear()}-${
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
