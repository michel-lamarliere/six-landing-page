import React, { Dispatch, SetStateAction, useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';

import {
	addDays,
	addMonths,
	addYears,
	format,
	getDay,
	getWeek,
	getWeeksInMonth,
	getYear,
	isBefore,
	isSameWeek,
	startOfMonth,
} from 'date-fns';

import { getMonthFnTypes, useDatesFn } from '../../../_shared/hooks/dates-hook';

import Calendar, { calendarTypes } from '../../../_shared/components/Calendar/Calendar';

import calendarClasses from '../../../_shared/components/Calendar/Calendar.module.scss';
import { CalendarActionTypes } from '../../../_shared/store/calendar';

const WeeklyCalendar: React.FC<{
	chosenDate: Date;
	setChosenDate: Dispatch<SetStateAction<Date>>;
	headerText: string;
}> = (props) => {
	const dispatch = useDispatch();
	const { getMonthFn } = useDatesFn();

	const [calendarDate, setCalendarDate] = useState(new Date());
	const [calendarMonthStr, setCalendarMonthStr] = useState('');
	const [weeks, setWeeks] = useState<Date[][]>([]);
	const [weekNumbers, setWeekNumbers] = useState<number[]>([]);

	const previousHandler = () => {
		props.setChosenDate(addDays(props.chosenDate, -7));
	};

	const nextHandler = () => {
		props.setChosenDate(addDays(props.chosenDate, 7));
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

	const createWeekCalendar = () => {
		const weeksInMonth = getWeeksInMonth(calendarDate, { weekStartsOn: 1 });
		const firstDateOfMonth = startOfMonth(calendarDate);
		const dayOfFirstDateOfMonth = getDay(firstDateOfMonth);

		let firstDateOfFirstWeekOfMonth = addDays(
			firstDateOfMonth,
			-dayOfFirstDateOfMonth + 1
		);

		const weeks: Date[][] = [];
		const weekNumbers = [];
		for (let i = 0; i < weeksInMonth; i++) {
			const week: Date[] = [];
			for (let y = 0; y < 7; y++) {
				week.push(addDays(firstDateOfFirstWeekOfMonth, y));
			}
			weekNumbers.push(
				getWeek(firstDateOfFirstWeekOfMonth, {
					weekStartsOn: 1,
					firstWeekContainsDate: 4,
				})
			);

			firstDateOfFirstWeekOfMonth = addDays(firstDateOfFirstWeekOfMonth, 7);

			weeks.push(week);
		}

		setWeeks(weeks);
		setWeekNumbers(weekNumbers);
	};

	const weekOnClickHandler = (event: React.MouseEvent<HTMLButtonElement>) => {
		event.preventDefault();
		const year = (event.target as HTMLElement).id.slice(0, 4);
		const month = (event.target as HTMLElement).id.slice(5, 7);
		const day = (event.target as HTMLElement).id.slice(8, 10);

		props.setChosenDate(new Date(+year, +month - 1, +day));

		dispatch({ type: CalendarActionTypes.HIDE_CALENDAR });
	};

	useEffect(() => {
		getMonthFn(
			getMonthFnTypes.STATE,
			calendarDate.getMonth(),
			true,
			setCalendarMonthStr
		);
		createWeekCalendar();
	}, [calendarDate]);

	return (
		<Calendar
			calendar={calendarTypes.WEEKLY}
			previousHandler={previousHandler}
			previousHandlerDisabled={isBefore(
				addDays(props.chosenDate, -7),
				new Date(2020, 0, 1)
			)}
			headerText={props.headerText}
			nextHandler={nextHandler}
			nextHandlerDisabled={!isBefore(addDays(props.chosenDate, 7), new Date())}
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
			<div className={calendarClasses.week}>
				<div className={calendarClasses.week__numbers}>
					{weekNumbers.map((weekNumber, index) => (
						<div
							className={calendarClasses.week__numbers__number}
							key={`CalendarWeek-${weekNumber}`}
						>
							{weekNumber}
						</div>
					))}
				</div>
				<div className={calendarClasses.week__calendar}>
					{weeks.length > 0 &&
						weeks.map((week) => (
							<button
								className={`${calendarClasses.week__calendar__week} ${
									!isBefore(new Date(week[0]), new Date()) &&
									calendarClasses['week__calendar__week--disabled']
								}`}
								onClick={weekOnClickHandler}
								disabled={!isBefore(new Date(week[0]), new Date())}
								id={`${format(new Date(week[6]), 'yyyy-MM-dd')}`}
								key={`${format(new Date(week[6]), 'yyyy-MM-dd')}`}
							>
								{week.map((day: Date) => (
									<button
										className={`${calendarClasses.day}
										${!isBefore(day, new Date()) && calendarClasses['day--disabled']}
										 ${
												!isBefore(day, new Date()) &&
												isSameWeek(day, new Date(), {
													weekStartsOn: 1,
												}) &&
												calendarClasses[
													'day--disabled--same-week'
												]
											}`}
										id={`${format(new Date(week[6]), 'yyyy-MM-dd')}`}
										key={`${format(new Date(week[6]), 'yyyy-MM-dd')}`}
									>
										{format(day, 'd')}
									</button>
								))}
							</button>
						))}
				</div>
			</div>
		</Calendar>
	);
};

export default WeeklyCalendar;
