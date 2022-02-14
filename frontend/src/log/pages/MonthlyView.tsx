import React, { useEffect, useState } from 'react';

import { useDispatch, useSelector } from 'react-redux';

import { getDay, format, isAfter, startOfMonth } from 'date-fns';

import { useRequest } from '../../shared/hooks/http-hook';
import { useDatesFn } from '../../shared/hooks/dates-hook';
import { RootState } from '../../shared/store/store';
import { ErrorPopupActionTypes } from '../../shared/store/error';

import MonthlyCalendar from '../../shared/components/Calendar/MonthlyCalendar';
import { DataButton } from '../components/Buttons';

import classes from './MonthlyView.module.scss';

const MonthlyView: React.FC = () => {
	const dispatch = useDispatch();
	const { sendRequest, sendData } = useRequest();
	const { getMonthFn } = useDatesFn();

	const userState = useSelector((state: RootState) => state.user);

	const [chosenDate, setChosenDate] = useState<Date>(startOfMonth(new Date()));
	const [monthStr, setMonthStr] = useState('');
	const [monthlyArray, setMonthlyArray] = useState<any[]>([]);
	const [currentTask, setCurrentTask] = useState('food');
	const [emptyBoxes, setEmptyBoxes] = useState<0[]>([]);

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

	useEffect(() => {
		if (userState.id) {
			getMonthlyData();
			getMonthFn(chosenDate.getMonth(), true, setMonthStr);
		}
	}, [chosenDate, currentTask]);

	return (
		<div className={classes.wrapper}>
			<MonthlyCalendar
				chosenDate={chosenDate}
				setChosenDate={setChosenDate}
				setCurrentTask={setCurrentTask}
				headerText={`${monthStr} ${chosenDate.getFullYear()}`}
				currentTask={currentTask}
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
			<div className={classes.calendar}>
				{emptyBoxes.length > 0 &&
					emptyBoxes.map((item) => <div key={item + Math.random()}></div>)}
				{monthlyArray &&
					monthlyArray.map((item: { date: number; level: 0 }, index) => (
						<div
							className={classes.calendar__button}
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
