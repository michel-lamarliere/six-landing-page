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
} from 'date-fns';

import { useRequest } from '../../../shared/hooks/http-hook';
import { RootState } from '../../../shared/store/store';
import { useDispatch, useSelector } from 'react-redux';
import {
	DataButton,
	PlaceHolderDataButton,
} from '../../../shared/components/UIElements/Buttons';

const MonthlyView: React.FC = () => {
	const dispatch = useDispatch();
	const { sendRequest, sendData } = useRequest();
	const userState = useSelector((state: RootState) => state.user);
	const [chosenDate, setChosenDate] = useState<Date>(new Date());
	const [monthStr, setMonthStr] = useState('');
	const [monthlyArray, setMonthlyArray] = useState<number[]>([]);
	const [datesArray, setDatesArray] = useState<string[]>([]);
	const selectSixRef = useRef<HTMLSelectElement>(null);
	const [currentTask, setCurrentTask] = useState('food');
	const [isLoading, setIsLoading] = useState(true);
	const [numberArrayPlaceholder, setNumberArrayPlaceholder] = useState<number[]>([]);
	const [datesArrayPlaceholder, setDatesArrayPlaceholder] = useState<string[]>([]);
	const [emptyBoxes, setEmptyBoxes] = useState<0[]>([]);

	const selectHandler = () => {
		setIsLoading(false);

		if (selectSixRef.current) {
			setCurrentTask(selectSixRef.current?.value);
		}
	};

	const previousMonthHandler = () => {
		setIsLoading(false);
		setChosenDate(addMonths(chosenDate, -1));
	};

	const nextMonthHandler = () => {
		setIsLoading(false);

		if (!isAfter(addMonths(chosenDate, 1), new Date())) {
			setChosenDate(addMonths(chosenDate, 1));
		}
	};

	const getMonthlyData = async () => {
		const chosenMonthStr = format(chosenDate, 'yyyy-MM-dd');

		if (selectSixRef.current) {
			const responseData = await sendRequest(
				`http://localhost:8080/api/logs/monthly/${userState.id}/${chosenMonthStr}/${currentTask}`,
				'GET'
			);

			const { datesArray: responseDatesArray, responseArray } = responseData;
			setDatesArray(responseDatesArray);
			setMonthlyArray(responseArray);
		}

		setIsLoading(true);
		getFirstDayOfWeek(chosenDate);
	};

	const addData = async (event: React.MouseEvent<HTMLButtonElement>) => {
		let date = (event.target as HTMLElement).id.split('_')[0];
		let task = (event.target as HTMLButtonElement).id.split('_')[1];
		let prevLevel = parseInt((event.target as HTMLButtonElement).value);

		if (userState.id && userState.email) {
			const responseData = await sendData(
				userState.id,
				userState.email,
				date,
				task,
				prevLevel
			);

			if (responseData.error) {
				dispatch({ type: 'SET-ERROR', message: responseData.error });
			}
		}
		getMonthlyData();
	};

	const placeholderCalendar = (date: Date) => {
		const numberOfDaysInMonth = getDaysInMonth(date);
		const array: number[] = [];

		for (let i = 0; i < numberOfDaysInMonth; i++) {
			array.push(0);
		}

		setNumberArrayPlaceholder(array);
	};

	const getDatesArrayPlaceholder = (date: Date) => {
		const numberOfDays: number = getDaysInMonth(date);
		const datesArray: string[] = [];

		for (let i = 1; i < numberOfDays + 1; i++) {
			let testDate =
				i < 10
					? date.toISOString().slice(0, 7) + '-0' + i.toString()
					: date.toISOString().slice(0, 7) + '-' + i.toString();
			datesArray.push(testDate);
		}

		setDatesArrayPlaceholder(datesArray);
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

	useEffect(() => {
		if (typeof selectSixRef.current?.value === 'string' && userState.id !== null) {
			setCurrentTask(selectSixRef.current.value);
			getDatesArrayPlaceholder(chosenDate);
			getMonthlyData();
			placeholderCalendar(chosenDate);
			switch (chosenDate.getMonth()) {
				case 0:
					setMonthStr('Janvier');
					break;
				case 1:
					setMonthStr('Février');
					break;
				case 2:
					setMonthStr('Mars');
					break;
				case 3:
					setMonthStr('Avril');
					break;
				case 4:
					setMonthStr('Mai');
					break;
				case 5:
					setMonthStr('Juin');
					break;
				case 6:
					setMonthStr('Juillet');
					break;
				case 7:
					setMonthStr('Août');
					break;
				case 8:
					setMonthStr('Septembre');
					break;
				case 9:
					setMonthStr('Octobre');
					break;
				case 10:
					setMonthStr('Novembre');
					break;
				case 11:
					setMonthStr('Décembre');
					break;
				default:
					break;
			}
		}
	}, [chosenDate, currentTask]);

	return (
		<div className={classes.wrapper}>
			<div className={classes.month}>
				<button onClick={previousMonthHandler}>Mois précédent</button>
				<div>
					{monthStr} {getYear(chosenDate)}
				</div>
				<button
					onClick={nextMonthHandler}
					disabled={isAfter(addMonths(chosenDate, 1), new Date())}
				>
					Mois suivant
				</button>
			</div>
			<div>
				<select
					ref={selectSixRef}
					name='six'
					onChange={selectHandler}
					defaultValue='food'
				>
					<option value='food'>Alimentation</option>
					<option value='sleep'>Sommeil</option>
					<option value='sport'>Activité Physique</option>
					<option value='relaxation'>Détente</option>
					<option value='work'>Projets</option>
					<option value='social'>Vie Sociale</option>
				</select>
			</div>
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
				{isLoading
					? monthlyArray.map((item, index) => (
							<div
								className={classes.button_wrapper}
								key={`${datesArray[index]}_${currentTask}_div`}
							>
								<div>{index + 1}</div>
								<DataButton
									id={`${datesArray[index]}_${currentTask}`}
									onClick={addData}
									value={item}
									key={`${datesArray[index]}_${currentTask}`}
									disabled={
										!isAfter(
											new Date(
												+datesArray[index].slice(0, 4),
												+datesArray[index].slice(5, 7) === 12
													? 11
													: +datesArray[index].slice(5, 7) - 1,
												+datesArray[index].slice(8, 10)
											),
											new Date()
										)
									}
								/>
							</div>
					  ))
					: numberArrayPlaceholder.map((item, index) => (
							<div
								className={classes.button_wrapper}
								key={`${item}_${index}`}
							>
								<div>{index + 1}</div>
								<PlaceHolderDataButton
									key={`placeholderBtn_${index}`}
									disabled={
										!isAfter(
											new Date(
												+datesArrayPlaceholder[index].slice(0, 4),
												+datesArrayPlaceholder[index].slice(
													5,
													7
												) === 12
													? 11
													: +datesArrayPlaceholder[index].slice(
															5,
															7
													  ) - 1,
												+datesArrayPlaceholder[index].slice(8, 10)
											),
											new Date()
										)
									}
								/>
							</div>
					  ))}
			</div>
		</div>
	);
};

export default MonthlyView;
