import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { getDate, getDay, getYear, format } from 'date-fns';

import { RootState } from '../../../_shared/store/_store';

import { useRequest } from '../../../_shared/hooks/http-hook';
import { getMonthFnTypes, useDatesFn } from '../../../_shared/hooks/dates-hook';
import { useTask } from '../../../_shared/classes/task-hook';

import { DataButton } from '../../components/Buttons';
import DailyCalendar from '../components/DailyCalendar';

import classes from './DailyView.module.scss';

const DailyView: React.FC = () => {
	const dispatch = useDispatch();

	const { sendRequest, sendData } = useRequest();
	const { getDayFn, getMonthFn } = useDatesFn();
	const { Task } = useTask();

	const userState = useSelector((state: RootState) => state.user);

	const [dailyData, setDailyData] = useState<{}>();

	// CALENDAR
	const [isLoading, setIsLoading] = useState(true);
	const [chosenDate, setChosenDate] = useState(new Date());
	const [dayStr, setDayStr] = useState('');
	const [monthStr, setMonthStr] = useState('');

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

		getDailyData();
	};

	const getDailyData = async () => {
		const responseData = await sendRequest(
			`http://localhost:8080/api/log/daily/${userState.id}/${chosenDate
				.toISOString()
				.slice(0, 10)}`,
			'GET'
		);

		if (!responseData) {
			return;
		}

		setDailyData(responseData);
		setIsLoading(false);
	};

	useEffect(() => {
		if (userState.id) {
			getDailyData();
			getDayFn(getDay(chosenDate), setDayStr);
			getMonthFn(getMonthFnTypes.STATE, chosenDate.getMonth(), false, setMonthStr);
		}
	}, [chosenDate]);

	return (
		<div className={classes.wrapper}>
			<DailyCalendar
				chosenDate={chosenDate}
				setChosenDate={setChosenDate}
				headerText={`${dayStr} ${getDate(chosenDate)} ${monthStr} ${getYear(
					chosenDate
				)}`}
			/>
			{!isLoading &&
				dailyData &&
				Object.entries(dailyData).map((item: any[]) => (
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
