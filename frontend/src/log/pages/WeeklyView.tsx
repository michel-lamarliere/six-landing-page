import React, { useState, useEffect } from 'react';

import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../../shared/store/store';
import { ErrorPopupActionTypes } from '../../shared/store/error';

import WeekViewTasks from '../components/WeeklyViewTasks';

import { useRequest } from '../../shared/hooks/http-hook';
import { useDates } from '../../shared/hooks/dates-hook';

import {
	addDays,
	getISOWeek,
	startOfWeek,
	format,
	getYear,
	isAfter,
	isSameDay,
	addYears,
	addMonths,
	isBefore,
	getWeeksInMonth,
	startOfMonth,
	getDay,
	getWeek,
} from 'date-fns';

import classes from './WeeklyView.module.scss';
import Calendar from '../../shared/components/Calendar/Calendar';
import DaysOfWeek from '../../shared/components/Calendar/DaysOfWeek';

const WeekView: React.FC = () => {
	const { sendRequest, sendData } = useRequest();
	const { getMonthFn } = useDates();
	const dispatch = useDispatch();

	const userState = useSelector((state: RootState) => state.user);

	const [weekData, setWeekData] = useState<{ date: Date; six: {} }[]>([]);
	const [mappingArray, setMappingArray] = useState<any[]>([]);
	const [isLoading, setIsLoading] = useState(true);

	const [chosenDate, setChosenDate] = useState(addDays(new Date(), 0));
	const [monthStr, setMonthStr] = useState('');
	const firstOfWeek = startOfWeek(chosenDate, { weekStartsOn: 1 });
	const formattedFirstOfWeek = format(firstOfWeek, 'yyyy-MM-dd');

	const [calendarDate, setCalendarDate] = useState(new Date());
	const [emptyCalendarDays, setEmptyCalendarDays] = useState<any[]>([]);
	const [calendarDays, setCalendarDays] = useState<any[]>([]);
	const [weeks, setWeeks] = useState<any[]>([]);
	const [weekNumbers, setWeekNumbers] = useState<any[]>([]);

	const addData = async (event: React.MouseEvent<HTMLButtonElement>) => {
		const dateAndTaskStr = (event.target as HTMLElement).id;
		const prevLevel = parseInt((event.target as HTMLButtonElement).value);

		if (userState.id) {
			const responseData = await sendData(userState.id, dateAndTaskStr, prevLevel);

			if (!responseData) {
				return;
			}

			if (responseData.error) {
				dispatch({
					type: ErrorPopupActionTypes.SET_ERROR,
					message: responseData.error,
				});
			}

			getWeekData(userState.id, formattedFirstOfWeek);
		}
	};

	const getWeekData = async (userId: string, formattedFirstOfWeekStr: string) => {
		const responseData = await sendRequest(
			`http://localhost:8080/api/log/weekly/${userId}/${formattedFirstOfWeekStr}`,
			'GET'
		);

		if (!responseData) {
			return;
		}

		setIsLoading(false);
		setWeekData(responseData);
		getMappingArray(responseData, firstOfWeek);
	};

	const emptySixObject = (logDate: Date) => {
		let emptySix = {
			date: logDate,
			six: {
				food: 0,
				sleep: 0,
				sport: 0,
				relaxation: 0,
				work: 0,
				social: 0,
			},
		};

		return emptySix;
	};

	const getMappingArray = (weekData: { date: Date; six: {} }[], firstOfWeek: Date) => {
		let array = [];
		let i = 0;
		let y = 0;

		do {
			if (
				weekData[i] &&
				isSameDay(new Date(weekData[i].date), addDays(firstOfWeek, y))
			) {
				array.push(weekData[i]);
				i++;
				y++;
			} else {
				array.push(emptySixObject(addDays(firstOfWeek, y)));
				y++;
			}
		} while (array.length < 7);

		setMappingArray(array);
	};

	const previousHandler = () => {
		setChosenDate(addDays(chosenDate, -7));
	};

	const nextHandler = () => {
		setChosenDate(addDays(chosenDate, 7));
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

		const weeks = [];
		const weekNumbers = [];
		for (let i = 0; i < weeksInMonth; i++) {
			const week = [];
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

	const weekOnClickHandler = (event: React.MouseEvent<HTMLElement>) => {
		event.preventDefault();
		const year = (event.target as HTMLElement).id.slice(0, 4);
		const month = (event.target as HTMLElement).id.slice(5, 7);
		const day = (event.target as HTMLElement).id.slice(8, 10);
		console.log((event.target as HTMLElement).id);
		// console.log(year, month, day);
		setChosenDate(new Date(+year, +month - 1, +day));
		// props.setShowCalendar(false);
	};

	useEffect(() => {
		if (userState.id) {
			getWeekData(userState.id, formattedFirstOfWeek);
			getMappingArray(weekData, firstOfWeek);
			getMonthFn(chosenDate.getMonth(), true, setMonthStr);
		}
	}, [userState.id, chosenDate]);

	useEffect(() => {
		createWeekCalendar();
	}, [calendarDate]);

	return (
		<div className={classes.wrapper}>
			<Calendar
				calendar={'WEEKLY'}
				taskSelector={false}
				selectHandler={null}
				previousHandler={previousHandler}
				previousHandlerDisabled={isBefore(
					addDays(chosenDate, -7),
					new Date(2020, 0, 1)
				)}
				headerText={`Semaine: ${getISOWeek(chosenDate)} | ${monthStr} ${getYear(
					chosenDate
				)}`}
				nextHandler={nextHandler}
				nextHandlerDisabled={!isBefore(addDays(chosenDate, 7), new Date())}
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
				calendarText={''}
				calendarNextMonthHandler={calendarNextMonthHandler}
				calendarNextMonthHandlerDisabled={
					!isBefore(addMonths(calendarDate, 1), new Date())
				}
				calendarNextYearHandler={calendarNextYearHandler}
				calendarNextYearHandlerDisabled={
					!isBefore(addYears(calendarDate, 1), new Date())
				}
			>
				<div className={classes.calendar__calendar__numbers}>
					{weekNumbers.map((weekNumber) => (
						<div>{weekNumber}</div>
					))}
				</div>
				<div className={classes.calendar__calendar__}>
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
										className={classes.calendar__weeks_days}
										onClick={weekOnClickHandler}
										disabled={
											!isBefore(new Date(week[0]), new Date())
										}
										id={`${format(new Date(week[6]), 'yyyy-MM-dd')}`}
									>
										{format(day, 'dd')}
									</button>
								))}
							</button>
						))}
				</div>
			</Calendar>
			<div>
				<div className={classes.days}>
					<li>Lundi {addDays(firstOfWeek, 0).getDate()}</li>
					<li>Mardi {addDays(firstOfWeek, 1).getDate()}</li>
					<li>Mercredi {addDays(firstOfWeek, 2).getDate()}</li>
					<li>Jeudi {addDays(firstOfWeek, 3).getDate()}</li>
					<li>Vendredi {addDays(firstOfWeek, 4).getDate()}</li>
					<li>Samedi {addDays(firstOfWeek, 5).getDate()}</li>
					<li>Dimanche {addDays(firstOfWeek, 6).getDate()}</li>
				</div>
				<div className={classes.six}>
					<div className={classes.six_titles}>
						<li>Food</li>
						<li>Sleep</li>
						<li>Sport</li>
						<li>Relaxation</li>
						<li>Work</li>
						<li>Social</li>
					</div>
					<WeekViewTasks
						isLoading={isLoading}
						array={mappingArray}
						onClick={addData}
					/>
				</div>
			</div>
		</div>
	);
};

export default WeekView;
