import React, { useEffect, useState, useRef } from 'react';
import {
	addMonths,
	getDay,
	getYear,
	format,
	isAfter,
	getDaysInMonth,
	startOfMonth,
	addHours,
	addDays,
	addYears,
	isBefore,
} from 'date-fns';

import { useRequest } from '../../shared/hooks/http-hook';
import { useDates } from '../../shared/hooks/dates-hook';
import { RootState } from '../../shared/store/store';
import { useDispatch, useSelector } from 'react-redux';
import { DataButton } from '../components/Buttons';
import { ErrorPopupActionTypes } from '../../shared/store/error';

import Calendar from '../../shared/components/Calendar/Calendar';

import classes from './MonthlyView.module.scss';

const MonthlyView: React.FC = () => {
	const dispatch = useDispatch();
	const { sendRequest, sendData } = useRequest();
	const { getMonthFn } = useDates();

	const userState = useSelector((state: RootState) => state.user);

	const [chosenDate, setChosenDate] = useState<Date>(startOfMonth(new Date()));
	const [monthStr, setMonthStr] = useState('');
	const [monthlyArray, setMonthlyArray] = useState<any[]>([]);
	const [currentTask, setCurrentTask] = useState('food');
	const [emptyBoxes, setEmptyBoxes] = useState<0[]>([]);

	const [calendarDate, setCalendarDate] = useState(new Date());
	const [emptyCalendarDays, setEmptyCalendarDays] = useState<any[]>([]);
	const [calendarDays, setCalendarDays] = useState<any[]>([]);
	const [weeks, setWeeks] = useState<any[]>([]);
	const [weekNumbers, setWeekNumbers] = useState<any[]>([]);
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
		setCurrentTask(event.target.value);
	};

	const addData = async (event: React.MouseEvent<HTMLButtonElement>) => {
		const dateAndTaskStr = (event.target as HTMLElement).id;
		const prevLevel = parseInt((event.target as HTMLButtonElement).value);

		if (userState.id && userState.email) {
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
		}
		getMonthlyData();
	};

	const getMonthlyData = async () => {
		const chosenMonthStr = format(chosenDate, 'yyyy-MM-dd');

		const responseData = await sendRequest(
			`http://localhost:8080/api/log/monthly/${userState.id}/${chosenMonthStr}/${currentTask}`,
			'GET'
		);

		if (!responseData) {
			return;
		}

		setMonthlyArray(responseData);
		getFirstDayOfWeek(chosenDate);
	};

	const getFirstDayOfWeek = (date: Date) => {
		let dayOfFirstOfMonth: number = getDay(startOfMonth(date));

		if (dayOfFirstOfMonth === 0) {
			dayOfFirstOfMonth = 7;
		}

		const emptyArray: 0[] = [];

		for (let i = 1; i < dayOfFirstOfMonth; i++) {
			emptyArray.push(0);
		}

		setEmptyBoxes(emptyArray);
	};

	const previousHandler = () => {
		setChosenDate(addMonths(chosenDate, -1));
	};

	const nextHandler = () => {
		setChosenDate(addDays(chosenDate, 7));
	};

	const calendarPreviousYearHandler = () => {
		setCalendarDate(addYears(calendarDate, -1));
	};

	const calendarNextYearHandler = () => {
		setCalendarDate(addYears(calendarDate, 1));
	};

	const monthOnClickHandler = (event: React.MouseEvent<HTMLButtonElement>) => {
		setChosenDate(new Date((event.target as HTMLButtonElement).id));
		// props.setShowCalendar(false);
	};

	useEffect(() => {
		if (userState.id) {
			getMonthlyData();
			getMonthFn(chosenDate.getMonth(), true, setMonthStr);
		}
	}, [chosenDate, currentTask]);

	return (
		<div className={classes.wrapper}>
			<Calendar
				calendar={'MONTHLY'}
				taskSelector={true}
				selectHandler={selectHandler}
				previousHandler={previousHandler}
				previousHandlerDisabled={isBefore(
					addMonths(chosenDate, -1),
					new Date(2020, 0, 1)
				)}
				headerText={`${monthStr} ${getYear(chosenDate)}`}
				nextHandler={nextHandler}
				nextHandlerDisabled={!isBefore(addMonths(chosenDate, 1), new Date())}
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
					!isBefore(addYears(calendarDate, 1), addYears(new Date(), 1))
				}
			>
				{months.map((month, index) => (
					<button
						className={classes.month}
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
			</Calendar>
			<div className={classes.days}>
				<li>Lundi</li>
				<li>Mardi</li>
				<li>Mercredi</li>
				<li>Jeudi</li>
				<li>Vendredi</li>
				<li>Samedi</li>
				<li>Dimanche</li>
			</div>
			<div className={classes.calendar_wrapper}>
				{emptyBoxes.length > 0 &&
					emptyBoxes.map((item) => <div key={item + Math.random()}></div>)}
				{monthlyArray &&
					monthlyArray.map((item: { date: number; level: 0 }, index) => (
						<div
							className={classes.button_wrapper}
							key={`${format(
								new Date(item.date),
								'yyyy-MM-dd'
							)}_${currentTask}_div`}
						>
							<div>{index + 1}</div>

							<DataButton
								id={`${format(
									new Date(item.date),
									'yyyy-MM-dd'
								)}_${currentTask}`}
								onClick={addData}
								value={item.level}
								key={`${format(
									new Date(item.date),
									'yyyy-MM-dd'
								)}_${currentTask}`}
								disabled={!isAfter(new Date(item.date), new Date())}
							/>
						</div>
					))}
			</div>
		</div>
	);
};

export default MonthlyView;
