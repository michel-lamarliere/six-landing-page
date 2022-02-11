import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
	addDays,
	getDate,
	getDay,
	getYear,
	format,
	isBefore,
	getDaysInMonth,
	getMonth,
	addHours,
	addYears,
	addMonths,
} from 'date-fns';
import classes from './DailyView.module.scss';

import { useRequest } from '../../shared/hooks/http-hook';
import { DataButton } from '../components/Buttons';
import { RootState } from '../../shared/store/store';
import { ErrorPopupActionTypes } from '../../shared/store/error';
import { useDates } from '../../shared/hooks/dates-hook';
import Calendar from '../../shared/components/Calendar/Calendar';

const DailyView: React.FC = () => {
	const dispatch = useDispatch();
	const { sendRequest, sendData } = useRequest();
	const { getDayFn, getMonthFn } = useDates();

	const userState = useSelector((state: RootState) => state.user);

	const [isLoading, setIsLoading] = useState(true);
	const [chosenDate, setChosenDate] = useState(new Date());
	const [dayStr, setDayStr] = useState('');
	const [monthStr, setMonthStr] = useState('');
	const [dailyData, setDailyData] = useState<any>([]);

	const [calendarDate, setCalendarDate] = useState(new Date());
	const [emptyCalendarDays, setEmptyCalendarDays] = useState<any[]>([]);
	const [calendarDays, setCalendarDays] = useState<any[]>([]);

	const addData = async (event: React.MouseEvent<HTMLButtonElement>) => {
		const dateAndTaskStr = (event.target as HTMLElement).id;
		const prevLevel = parseInt((event.target as HTMLButtonElement).value);
		console.log((event.target as HTMLElement).id);

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
				return;
			}
			if (responseData) {
				getDailyData(userState.id, chosenDate.toISOString().slice(0, 10));
			}
		}
	};

	const getDailyData = async (userId: string, date: string) => {
		const responseData = await sendRequest(
			`http://localhost:8080/api/log/daily/${userId}/${date}`,
			'GET'
		);

		if (!responseData) {
			return;
		}

		setDailyData(responseData);
		setIsLoading(false);
	};

	const previousHandler = () => {
		setChosenDate(addDays(chosenDate, -1));
	};

	const nextHandler = () => {
		setChosenDate(addDays(chosenDate, 1));
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

		let firstDayOfWeek: number = getDay(calendarDate);
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
		setChosenDate(addHours(new Date(+year, +month, +day), 1));
		// props.setShowCalendar(false);
	};

	useEffect(() => {
		getMonthFn(calendarDate.getMonth(), true, setMonthStr);
		console.log(calendarDate);
		createDayCalendar();
	}, [calendarDate]);

	useEffect(() => {
		if (userState.id) {
			getDailyData(userState.id, chosenDate.toISOString().slice(0, 10));
			getDayFn(getDay(chosenDate), setDayStr);
			getMonthFn(chosenDate.getMonth(), true, setMonthStr);
		}
	}, [chosenDate]);

	return (
		<div className={classes.wrapper}>
			<Calendar
				calendar={'DAILY'}
				taskSelector={false}
				selectHandler={null}
				previousHandler={previousHandler}
				previousHandlerDisabled={isBefore(
					addDays(calendarDate, -1),
					new Date(2020, 0, 1)
				)}
				headerText={`${dayStr} ${getDate(chosenDate)} ${monthStr}
					${getYear(chosenDate)}`}
				nextHandler={nextHandler}
				nextHandlerDisabled={!isBefore(addDays(calendarDate, 1), new Date())}
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
				calendarText={`${monthStr} ${getYear(calendarDate)}`}
				calendarNextMonthHandler={calendarNextMonthHandler}
				calendarNextMonthHandlerDisabled={
					!isBefore(addMonths(calendarDate, 1), new Date())
				}
				calendarNextYearHandler={calendarNextYearHandler}
				calendarNextYearHandlerDisabled={
					!isBefore(addYears(calendarDate, 1), new Date())
				}
			>
				{emptyCalendarDays.map((emptyDay) => (
					<div></div>
				))}
				{calendarDays.map((day) => (
					<button
						className={classes.day}
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
			</Calendar>
			{!isLoading &&
				dailyData &&
				Object.entries(dailyData.six).map((item: any) => (
					<div
						className={classes.task}
						key={`${format(chosenDate, 'yyyy-MM-dd')}_${item[0]}_task`}
					>
						<div>{item[0]}</div>
						<DataButton
							id={`${format(chosenDate, 'yyyy-MM-dd')}_${item[0]}`}
							onClick={addData}
							value={item[1]}
							disabled={true}
						/>
					</div>
				))}
		</div>
	);
};

export default DailyView;
