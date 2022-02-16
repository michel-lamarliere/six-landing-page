import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { getDay, format, isAfter, startOfMonth } from 'date-fns';

import { RootState } from '../../_shared/store/store';
import { ErrorPopupActionTypes } from '../../_shared/store/error';

import { useRequest } from '../../_shared/hooks/http-hook';
import { getMonthFnTypes, useDatesFn } from '../../_shared/hooks/dates-hook';

import MonthlyCalendar from '../../_shared/components/Calendar/MonthlyCalendar';
import { DataButton } from '../components/Buttons';

import classes from './MonthlyView.module.scss';

const MonthlyView: React.FC = () => {
	const dispatch = useDispatch();
	const { sendRequest, sendData } = useRequest();
	const { getMonthFn } = useDatesFn();

	const userState = useSelector((state: RootState) => state.user);

	// CALENDAR
	const [chosenDate, setChosenDate] = useState<Date>(startOfMonth(new Date()));
	const [monthStr, setMonthStr] = useState('');
	const [monthlyArray, setMonthlyArray] = useState<any[]>([]);
	const [chosenTask, setChosenTask] = useState('food');
	const [emptyBoxes, setEmptyBoxes] = useState<0[]>([]);

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
			`http://localhost:8080/api/log/monthly/${userState.id}/${chosenMonthStr}/${chosenTask}`,
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
			getMonthFn(getMonthFnTypes.STATE, chosenDate.getMonth(), setMonthStr);
		}
	}, [chosenDate, chosenTask]);

	return (
		<div className={classes.wrapper}>
			<MonthlyCalendar
				chosenDate={chosenDate}
				setChosenDate={setChosenDate}
				chosenTask={chosenTask}
				setChosenTask={setChosenTask}
				headerText={`${monthStr} ${chosenDate.getFullYear()}`}
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
							)}_${chosenTask}_div`}
						>
							<div>{index + 1}</div>

							<DataButton
								id={`${format(
									new Date(item.date),
									'yyyy-MM-dd'
								)}_${chosenTask}`}
								onClick={addData}
								value={item.level}
								key={`${format(
									new Date(item.date),
									'yyyy-MM-dd'
								)}_${chosenTask}`}
								disabled={!isAfter(new Date(item.date), new Date())}
							/>
						</div>
					))}
			</div>
		</div>
	);
};

export default MonthlyView;
