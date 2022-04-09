import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';

import {
	getDay,
	format,
	isAfter,
	startOfMonth,
	isSameDay,
	isBefore,
	addHours,
} from 'date-fns';

import { RootState } from '../../../_shared/store/_store';

import { useRequest } from '../../../_shared/hooks/http-hook';
import { getMonthFnTypes, useDatesFn } from '../../../_shared/hooks/dates-hook';
import { useTaskClass } from '../../../_shared/classes/task-class-hook';

import MonthlyCalendar from '../components/MonthlyCalendar';
import { DataButton } from '../../components/DataButtons';

import classes from './MonthlyView.module.scss';

const MonthlyView: React.FC = () => {
	const { sendRequest } = useRequest();
	const { getMonthFn } = useDatesFn();
	const { Task } = useTaskClass();

	const userState = useSelector((state: RootState) => state.user);

	// CALENDAR
	const [chosenDate, setChosenDate] = useState<Date>(startOfMonth(new Date()));
	const [monthStr, setMonthStr] = useState('');
	const [monthlyArray, setMonthlyArray] = useState<[]>([]);
	const [chosenTask, setChosenTask] = useState('food');
	const [emptyBoxes, setEmptyBoxes] = useState<0[]>([]);

	const addData = async (event: React.MouseEvent<HTMLButtonElement>) => {
		const dateAndTaskStr = (event.target as HTMLElement).id;
		const previousLevel = parseInt((event.target as HTMLButtonElement).value);

		const date = dateAndTaskStr.split('_')[0];
		const task = dateAndTaskStr.split('_')[1];

		const newTaskObj = {
			date,
			task,
			previousLevel,
		};

		const newTask = new Task(newTaskObj);

		await newTask.save();

		getMonthlyData();
	};

	const getMonthlyData = async () => {
		const chosenMonthStr = format(chosenDate, 'yyyy-MM-dd');

		const responseData = await sendRequest({
			url: `${process.env.REACT_APP_BACKEND_URL}/log/monthly/${userState.id}/${chosenMonthStr}/${chosenTask}`,
			method: 'GET',
		});

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
			getMonthFn({
				type: getMonthFnTypes.STATE,
				monthNumber: chosenDate.getMonth(),
				abreviation: false,
				setState: setMonthStr,
			});
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
				<li>LUN</li>
				<li>MAR</li>
				<li>MER</li>
				<li>JEU</li>
				<li>VEN</li>
				<li>SAM</li>
				<li>DIM</li>
			</div>
			<div className={classes.calendar}>
				{emptyBoxes.length > 0 &&
					emptyBoxes.map((item) => <div key={item + Math.random()}></div>)}
				{monthlyArray &&
					monthlyArray.map((item: { date: string; level: 0 }, index) => (
						<>
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
								disabled={
									isAfter(new Date(item.date), new Date()) &&
									!isSameDay(
										addHours(new Date(item.date), 0),
										new Date()
									)
								}
								dayNumber={index + 1}
							/>
						</>
					))}
			</div>
		</div>
	);
};

export default MonthlyView;
