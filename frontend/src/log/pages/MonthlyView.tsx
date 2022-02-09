import React, { useEffect, useState, useRef } from 'react';
import classes from './MonthlyView.module.scss';
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
} from 'date-fns';

import { useRequest } from '../../shared/hooks/http-hook';
import { useDates } from '../../shared/hooks/dates-hook';
import { RootState } from '../../shared/store/store';
import { useDispatch, useSelector } from 'react-redux';
import { DataButton, PlaceHolderDataButton } from '../components/Buttons';
import { ErrorPopupActionTypes } from '../../shared/store/error';

import LogHeader from '../components/LogHeader';

import DatePicker, { registerLocale } from 'react-datepicker';
import fr from 'date-fns/locale/fr';

import 'react-datepicker/dist/react-datepicker.css';
import CalendarButton from '../components/CalendarButton';

const MonthlyView: React.FC = () => {
	const dispatch = useDispatch();
	const { sendRequest, sendData } = useRequest();
	const { getMonthFn } = useDates();

	registerLocale('fr', fr);

	const userState = useSelector((state: RootState) => state.user);

	const [chosenDate, setChosenDate] = useState<Date>(startOfMonth(new Date()));
	const [monthStr, setMonthStr] = useState('');
	const [monthlyArray, setMonthlyArray] = useState<any[]>([]);
	const [currentTask, setCurrentTask] = useState('food');
	const [emptyBoxes, setEmptyBoxes] = useState<0[]>([]);
	const [showCalendar, setShowCalendar] = useState(false);

	const selectHandler = (event: React.ChangeEvent<HTMLSelectElement>) => {
		setCurrentTask(event.target.value);
	};

	const previousMonthHandler = () => {
		setChosenDate(addMonths(chosenDate, -1));
	};

	const nextMonthHandler = () => {
		if (!isAfter(addMonths(chosenDate, 1), new Date())) {
			setChosenDate(addMonths(chosenDate, 1));
		}
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

		dayOfFirstOfMonth =
			dayOfFirstOfMonth === 0
				? (dayOfFirstOfMonth = 7)
				: (dayOfFirstOfMonth = dayOfFirstOfMonth - 1);

		const emptyArray: 0[] = [];

		for (let i = 0; i < dayOfFirstOfMonth; i++) {
			emptyArray.push(0);
		}

		setEmptyBoxes(emptyArray);
	};

	const calendarButtonHandler = () => {
		setShowCalendar((prev) => !prev);
	};

	const calendarOnChangeHandler = (date: Date) => {
		setShowCalendar(false);
		setChosenDate(date);
	};

	useEffect(() => {
		if (userState.id !== null) {
			getMonthlyData();

			getMonthFn(chosenDate.getMonth(), true, setMonthStr);
		}
	}, [chosenDate, currentTask]);

	return (
		<div className={classes.wrapper}>
			<LogHeader
				button_previous_text='Mois précédent'
				button_previous_handler={previousMonthHandler}
				button_next_text='Mois suivant'
				button_next_handler={nextMonthHandler}
				button_next_disabled={isAfter(addMonths(chosenDate, 1), new Date())}
				text={`${monthStr} ${getYear(chosenDate)}`}
				selector_task={
					<select name='six' onChange={selectHandler} defaultValue='food'>
						<option value='food'>Alimentation</option>
						<option value='sleep'>Sommeil</option>
						<option value='sport'>Activité Physique</option>
						<option value='relaxation'>Détente</option>
						<option value='work'>Projets</option>
						<option value='social'>Vie Sociale</option>
					</select>
				}
				selector_date={
					<>
						<CalendarButton onClick={calendarButtonHandler} />
						{showCalendar && (
							<DatePicker
								selected={chosenDate}
								onChange={calendarOnChangeHandler}
								onSelect={(date: Date) => setChosenDate(date!)}
								showYearDropdown
								scrollableYearDropdown
								minDate={new Date(2020, 0, 1)}
								maxDate={new Date()}
								calendarStartDay={1}
								locale='fr'
								formatWeekDay={(nameOfDay) => nameOfDay.substr(0, 3)}
								showMonthYearPicker
								inline
							/>
						)}
					</>
				}
			/>
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
